
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://www.erasmatch.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
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

    // ── Look up sender name from database (never trust the client) ──
    const { data: senderProfile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', senderId)
      .single()

    const rawSenderName = senderProfile?.name || 'Someone'
    const senderName = escapeHtml(rawSenderName)

    // ── Look up receiver email and notification preference ──
    const { data: receiverProfile } = await supabase
      .from('profiles')
      .select('email, email_notifications')
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

    const messageContent = escapeHtml(message.content || '')

    // ── Send the email with server-verified data only ──
    const emailResponse = await resend.emails.send({
      from: "ErasMatch <team@erasmatch.com>",
      to: [to],
      subject: `You have new messages from ${rawSenderName} on ErasMatch`,
      html: `
        <h2>You have a new message from ${senderName}</h2>
        <p style="margin: 16px 0; padding: 12px; background-color: #f5f5f5; border-radius: 4px;">
          ${messageContent}
        </p>
        <a href="https://www.erasmatch.com/messages" style="display:inline-block;background-color:#4F46E5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;margin:16px 0;">Reply on ErasMatch →</a>
        <p style="color:#9CA3AF;font-size:12px;margin-top:24px;">You received this because you have an ErasMatch account. <a href="https://www.erasmatch.com/profile" style="color:#9CA3AF;">Unsubscribe from email notifications</a></p>
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
