import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { record } = await req.json()

    if (!record || !record.email) {
      console.log("No record or email found, skipping")
      return new Response(JSON.stringify({ skipped: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const firstName = record.name || "there"

    const emailResponse = await resend.emails.send({
      from: "ErasMatch <team@erasmatch.com>",
      to: [record.email],
      reply_to: "erasmatchbusiness@gmail.com",
      subject: "Welcome to ErasMatch 🌍",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding:40px 40px 0 40px;">
              <h1 style="margin:0 0 8px 0;font-size:28px;color:#111827;">
                <span style="color:#3B82F6;">Eras</span><span style="color:#22C55E;">Match</span>
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px 0 40px;">
              <h2 style="margin:0 0 16px 0;font-size:22px;color:#111827;">Hey ${firstName}! 👋</h2>
              <p style="margin:0 0 20px 0;font-size:16px;line-height:1.6;color:#374151;">
                Welcome to ErasMatch! We built this to help Erasmus students connect with each other before they even arrive at their destination.
              </p>
              <p style="margin:0 0 12px 0;font-size:16px;font-weight:600;color:#111827;">Here's what you can do:</p>
              <table cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
                <tr>
                  <td style="padding:8px 0;font-size:15px;line-height:1.5;color:#374151;">🔍 Find students going to your city</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:15px;line-height:1.5;color:#374151;">💬 Message them directly</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:15px;line-height:1.5;color:#374151;">🎓 Join your university group chat</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 40px 32px 40px;">
              <a href="https://erasmatch.com/profile" style="display:inline-block;background-color:#4F46E5;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">Complete Your Profile →</a>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 32px 40px;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:#6B7280;background-color:#f3f4f6;padding:16px;border-radius:8px;">
                <strong>P.S.</strong> ErasMatch is brand new and still growing. If you run into anything or have suggestions, just reply to this email. We read every message!
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 32px 40px;border-top:1px solid #e5e7eb;">
              <p style="margin:16px 0 0 0;font-size:12px;color:#9CA3AF;text-align:center;">
                You received this because you signed up for ErasMatch.
                <a href="https://erasmatch.com/profile" style="color:#9CA3AF;">Manage email preferences</a>
              </p>
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
