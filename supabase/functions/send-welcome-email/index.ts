import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://www.erasmatch.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/** Escape HTML to prevent injection via user-supplied fields. */
function esc(raw: string): string {
  return raw
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
    // Only allow calls from the service role (database webhook)
    const authHeader = req.headers.get('Authorization')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!authHeader || authHeader !== `Bearer ${serviceRoleKey}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { record } = await req.json()

    if (!record || !record.email) {
      console.log("No record or email found, skipping")
      return new Response(JSON.stringify({ skipped: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const firstName = esc(record.name?.split(' ')[0] || 'there')
    const city = esc(record.city || '')
    const hasCity = Boolean(record.city)

    // Dynamic copy based on whether we have a city
    const subject = hasCity
      ? `You're heading to ${city}!`
      : 'Welcome to ErasMatch'

    const heroHeadline = hasCity
      ? `You're heading to ${city}!`
      : 'Your Erasmus adventure starts here!'

    const introParagraph = hasCity
      ? `Welcome to ErasMatch - the easiest way to meet other Erasmus students heading to ${city}.`
      : 'Welcome to ErasMatch - the easiest way to meet other Erasmus students heading to your city.'

    const bodyParagraph = "Your first week abroad doesn't have to be figuring everything out alone. Have someone to go to the welcome week events with, find flatmates, and make friends before you even arrive."

    const bullet1 = hasCity
      ? `🔍 See who else is heading to ${city}`
      : '🔍 See who else is heading to your city'

    const bullet2 = '💬 Message someone before you even arrive'

    const bullet3 = hasCity
      ? `🏙️ Jump into the ${city} group chat`
      : '🏙️ Jump into your city group chat'

    const ctaText = hasCity
      ? `Find students in ${city}`
      : 'Find students near you'

    const ctaUrl = 'https://www.erasmatch.com/students'

    const emailResponse = await resend.emails.send({
      from: "ErasMatch <team@erasmatch.com>",
      to: [record.email],
      reply_to: "erasmatchbusiness@gmail.com",
      subject,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;">

          <!-- Navy header -->
          <tr>
            <td style="background-color:#1e293b;padding:40px 40px 36px 40px;text-align:center;">
              <h1 style="margin:0 0 6px 0;font-size:30px;font-weight:800;letter-spacing:-0.5px;">
                <span style="color:#3B82F6;">Eras</span><span style="color:#22C55E;">Match</span>
              </h1>
              <p style="margin:0 0 24px 0;font-size:11px;color:rgba(255,255,255,0.45);letter-spacing:2px;text-transform:uppercase;">YOUR ERASMUS NETWORK</p>
              <h2 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">
                ${heroHeadline}
              </h2>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 36px 0 36px;">
              <p style="margin:0 0 16px 0;font-size:17px;line-height:1.5;color:#111827;">
                Hey ${firstName}! 👋
              </p>
              <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#374151;">
                ${introParagraph}
              </p>
              <p style="margin:0 0 24px 0;font-size:16px;line-height:1.6;color:#374151;">
                ${bodyParagraph}
              </p>
            </td>
          </tr>

          <!-- Action items -->
          <tr>
            <td style="padding:0 36px;">
              <p style="margin:0 0 12px 0;font-size:15px;font-weight:600;color:#111827;">Here's what to do next:</p>
              <table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 28px 0;">
                <tr>
                  <td style="padding:10px 16px;font-size:15px;line-height:1.5;color:#374151;background-color:#eff6ff;border-radius:8px;">
                    ${bullet1}
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:10px 16px;font-size:15px;line-height:1.5;color:#374151;background-color:#f0fdf4;border-radius:8px;">
                    ${bullet2}
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:10px 16px;font-size:15px;line-height:1.5;color:#374151;background-color:#f0f9ff;border-radius:8px;">
                    ${bullet3}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA button -->
          <tr>
            <td align="center" style="padding:0 36px 32px 36px;">
              <a href="${ctaUrl}" style="display:inline-block;background-color:#22C55E;color:#ffffff;padding:14px 36px;border-radius:50px;text-decoration:none;font-weight:700;font-size:16px;letter-spacing:0.2px;">
                ${ctaText} &rarr;
              </a>
            </td>
          </tr>

          <!-- Sign off -->
          <tr>
            <td style="padding:0 36px 24px 36px;">
              <p style="margin:0;font-size:15px;line-height:1.5;color:#374151;">
                Welcome aboard!<br>
                <span style="color:#6B7280;">The ErasMatch team</span>
              </p>
            </td>
          </tr>

          <!-- P.S. -->
          <tr>
            <td style="padding:0 36px 28px 36px;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:#6B7280;background-color:#f9fafb;padding:14px 16px;border-radius:10px;">
                <strong>P.S.</strong> Got a question, found a bug, or have a feature idea? Just reply to this email.
              </p>
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
                    <p style="margin:0 0 4px 0;font-size:12px;color:#9CA3AF;">
                      <a href="https://www.erasmatch.com" style="color:#9CA3AF;text-decoration:none;">erasmatch.com</a>
                    </p>
                    <p style="margin:0;font-size:11px;color:#D1D5DB;">
                      You received this because you signed up for ErasMatch.
                      <a href="https://www.erasmatch.com/profile" style="color:#D1D5DB;text-decoration:underline;">Email preferences</a>
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

    console.log("Welcome email sent successfully:", emailResponse)

    return new Response(JSON.stringify(emailResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
