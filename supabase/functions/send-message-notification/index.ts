
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://www.erasmatch.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Truncate to a character limit, breaking at the last word boundary. */
function truncate(text: string, limit: number): { preview: string; truncated: boolean } {
  if (text.length <= limit) return { preview: text, truncated: false }
  // Find the last space before the limit so we don't cut mid-word
  const cut = text.lastIndexOf(' ', limit)
  const end = cut > limit * 0.4 ? cut : limit // Fall back if no good break point
  return { preview: text.slice(0, end), truncated: true }
}

/** First name only — "Grace Smith" → "Grace" */
function firstName(fullName: string): string {
  return fullName.split(' ')[0] || fullName
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { receiverId, messageId } = await req.json()

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (!receiverId || !messageId) {
      return new Response(JSON.stringify({ error: "receiverId and messageId are required" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // ── Authenticate sender from JWT ──
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const senderId = user.id

    // ── Look up sender profile (name, avatar, city, course) ──
    const { data: senderProfile } = await supabase
      .from('profiles')
      .select('name, avatar_url, city, course')
      .eq('id', senderId)
      .single()

    const rawSenderName = (senderProfile?.name || 'Someone').replace(/[\r\n]/g, '')
    const senderFirst = firstName(rawSenderName)
    const safeSenderName = esc(rawSenderName)
    const safeSenderFirst = esc(senderFirst)
    const senderCity = senderProfile?.city ?? null
    const senderCourse = senderProfile?.course ?? null
    const senderAvatar = senderProfile?.avatar_url ?? null

    // ── Look up receiver email, notification preference, and name ──
    const { data: receiverProfile } = await supabase
      .from('profiles')
      .select('email, email_notifications, name')
      .eq('id', receiverId)
      .single()

    const to = receiverProfile?.email
    if (!to) {
      return new Response(JSON.stringify({ skipped: true, reason: "no_email" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (receiverProfile.email_notifications === false) {
      console.log("Email notifications disabled for user:", receiverId)
      return new Response(JSON.stringify({ skipped: true, reason: "notifications_disabled" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const receiverFirst = firstName(receiverProfile.name || '')

    // ── Rate limit: 1 email per sender→receiver pair every 15 minutes ──
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString()
    const { data: recentLog } = await supabase
      .from('email_notification_log')
      .select('id')
      .eq('sender_id', senderId)
      .eq('receiver_id', receiverId)
      .gte('sent_at', fifteenMinutesAgo)
      .limit(1)

    if (recentLog && recentLog.length > 0) {
      console.log("Skipping email — already notified within 15 minutes", { senderId, receiverId })
      return new Response(JSON.stringify({ skipped: true, reason: "rate_limited" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // ── Fetch the exact message by ID and verify the sender owns it ──
    const { data: message } = await supabase
      .from('messages')
      .select('content')
      .eq('id', messageId)
      .eq('sender_id', senderId)
      .eq('receiver_id', receiverId)
      .single()

    if (!message) {
      return new Response(JSON.stringify({ error: "Message not found or sender mismatch" }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // ── Truncate message to 60 chars to create curiosity gap ──
    const rawContent = message.content || ''
    const { preview, truncated } = truncate(rawContent, 60)
    const safePreview = esc(preview)
    const ellipsis = truncated ? '…' : ''

    // Subject line: personal, short — "Sarah sent you a message 💬"
    // Strip CRLF to prevent header injection
    const subject = `${senderFirst} sent you a message 💬`.replace(/[\r\n]+/g, ' ')

    // Preheader: first words of the message for email client preview
    const preheaderText = esc(rawContent.slice(0, 100).replace(/[\r\n]+/g, ' '))

    // Build sender context line: "📍 Barcelona · 📚 Business Administration"
    const contextParts: string[] = []
    if (senderCity) contextParts.push(`📍 ${esc(senderCity)}`)
    if (senderCourse) contextParts.push(`📚 ${esc(senderCourse)}`)
    const contextLine = contextParts.join(' &nbsp;·&nbsp; ')

    // Reply CTA URL with tracking
    const replyUrl = 'https://www.erasmatch.com/messages?utm_source=erasmatch&utm_medium=email&utm_campaign=message_notification&utm_content=reply_cta'

    // Avatar HTML — show sender's photo if available, otherwise a gradient initial
    const initial = senderFirst.charAt(0).toUpperCase()
    const avatarHtml = senderAvatar
      ? `<img src="${esc(senderAvatar)}" alt="${safeSenderFirst}" width="56" height="56" style="width:56px;height:56px;border-radius:50%;object-fit:cover;display:block;" />`
      : `<div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#3B82F6,#22C55E);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;color:#ffffff;"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" style="width:56px;height:56px;" arcsize="50%" fillcolor="#3B82F6"><v:textbox inset="0,0,0,0" style="mso-fit-shape-to-text:true"><center style="font-size:24px;font-weight:700;color:#ffffff;">${initial}</center></v:textbox></v:roundrect><![endif]--><!--[if !mso]><!--><table cellpadding="0" cellspacing="0" border="0" style="width:56px;height:56px;"><tr><td align="center" valign="middle" style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#3B82F6,#22C55E);font-size:24px;font-weight:700;color:#ffffff;">${initial}</td></tr></table><!--<![endif]--></div>`

    // ── Send the redesigned email ──
    const emailResponse = await resend.emails.send({
      from: "ErasMatch <team@erasmatch.com>",
      to: [to],
      reply_to: "erasmatchbusiness@gmail.com",
      subject,
      headers: {
        'X-Entity-Ref-ID': messageId,
      },
      tags: [
        { name: 'email_type', value: 'message_notification' },
        { name: 'sender_city', value: senderCity || 'unknown' },
      ],
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--<![endif]-->
  <!-- Preheader text (hidden, shown in email client preview) -->
  <span style="display:none;font-size:1px;color:#f4f5f7;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheaderText}</span>
</head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;">

          <!-- Navy header — compact for notifications -->
          <tr>
            <td style="background-color:#1e293b;padding:24px 36px;text-align:center;">
              <h1 style="margin:0;font-size:22px;font-weight:800;letter-spacing:-0.3px;">
                <span style="color:#3B82F6;">Eras</span><span style="color:#22C55E;">Match</span>
              </h1>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:28px 36px 0 36px;">
              <p style="margin:0;font-size:16px;line-height:1.5;color:#374151;">
                ${receiverFirst ? `Hey ${esc(receiverFirst)}` : 'Hey'} 👋
              </p>
            </td>
          </tr>

          <!-- Sender card -->
          <tr>
            <td style="padding:20px 36px 0 36px;">
              <table cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:20px;">
                    <table cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <!-- Avatar -->
                        <td width="56" valign="top" style="padding-right:16px;">
                          ${avatarHtml}
                        </td>
                        <!-- Name + context -->
                        <td valign="top">
                          <p style="margin:0 0 2px 0;font-size:17px;font-weight:700;color:#111827;">
                            ${safeSenderName}
                          </p>
                          ${contextLine ? `<p style="margin:0;font-size:13px;color:#6B7280;line-height:1.4;">${contextLine}</p>` : ''}
                        </td>
                      </tr>
                    </table>

                    <!-- Message bubble -->
                    <table cellpadding="0" cellspacing="0" width="100%" style="margin-top:16px;">
                      <tr>
                        <td style="background-color:#ffffff;border-radius:12px;border:1px solid #e5e7eb;padding:14px 16px;">
                          <p style="margin:0;font-size:15px;line-height:1.5;color:#374151;">
                            "${safePreview}${ellipsis}"
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA button -->
          <tr>
            <td align="center" style="padding:24px 36px 28px 36px;">
              <a href="${replyUrl}" style="display:inline-block;background-color:#22C55E;color:#ffffff;padding:14px 36px;border-radius:50px;text-decoration:none;font-weight:700;font-size:16px;letter-spacing:0.2px;">
                Reply to ${safeSenderFirst} &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px 24px 36px;border-top:1px solid #e5e7eb;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <p style="margin:0 0 6px 0;font-size:13px;font-weight:600;color:#9CA3AF;">
                      <span style="color:#3B82F6;">Eras</span><span style="color:#22C55E;">Match</span>
                    </p>
                    <p style="margin:0;font-size:11px;color:#D1D5DB;">
                      You received this because someone messaged you on ErasMatch.
                      <a href="https://www.erasmatch.com/profile?utm_source=erasmatch&utm_medium=email&utm_campaign=message_notification&utm_content=email_prefs" style="color:#D1D5DB;text-decoration:underline;">Email preferences</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    })

    console.log("Email sent successfully:", emailResponse)

    // Log the notification
    await supabase.from('email_notification_log').insert({
      sender_id: senderId,
      receiver_id: receiverId,
    })

    return new Response(JSON.stringify(emailResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
