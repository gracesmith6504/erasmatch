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
    const { email, firstName } = await req.json()

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const name = firstName || "there"

    const emailResponse = await resend.emails.send({
      from: "ErasMatch <team@erasmatch.com>",
      reply_to: "erasmatchbusiness@gmail.com",
      to: [email],
      subject: "Welcome to ErasMatch 🌍",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3B82F6, #10B981);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;">
                <span>Eras</span><span>Match</span>
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h2 style="margin:0 0 16px;font-size:22px;color:#111827;">Hey ${name}! 👋</h2>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#374151;">
                Welcome to ErasMatch! We built this to help Erasmus students like you connect with others heading to the same city before you even arrive.
              </p>
              <p style="margin:0 0 12px;font-size:15px;font-weight:600;color:#111827;">Here's what you can do:</p>
              <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td style="padding:8px 0;font-size:15px;line-height:1.5;color:#374151;">
                    🔍&nbsp;&nbsp;Find students going to your city
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:15px;line-height:1.5;color:#374151;">
                    💬&nbsp;&nbsp;Message them directly
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:15px;line-height:1.5;color:#374151;">
                    🎓&nbsp;&nbsp;Join your university group chat
                  </td>
                </tr>
              </table>
              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding:8px 0 28px;">
                    <a href="https://erasmatch.com/profile" style="display:inline-block;background-color:#3B82F6;color:#ffffff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;">
                      Complete Your Profile &rarr;
                    </a>
                  </td>
                </tr>
              </table>
              <!-- PS -->
              <p style="margin:0;padding:20px 0 0;border-top:1px solid #e5e7eb;font-size:14px;line-height:1.6;color:#6B7280;">
                <strong>P.S.</strong> ErasMatch is brand new and still growing. If you run into anything or have suggestions, just reply to this email. We read every message and would love to hear from you!
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 28px;text-align:center;border-top:1px solid #f3f4f6;">
              <p style="margin:0;font-size:12px;color:#9CA3AF;">
                You received this because you signed up for ErasMatch.<br>
                <a href="https://erasmatch.com/profile" style="color:#9CA3AF;text-decoration:underline;">Manage your email preferences</a>
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

    console.log("Welcome email sent to:", email, emailResponse)

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
