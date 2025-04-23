
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string
  senderName: string
  messageContent: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { to, senderName, messageContent }: EmailRequest = await req.json()

    const emailResponse = await resend.emails.send({
      from: "ErasMatch <notifications@erasmatch.app>",
      to: [to],
      subject: `New message from ${senderName}`,
      html: `
        <h2>You have a new message from ${senderName}</h2>
        <p style="margin: 16px 0; padding: 12px; background-color: #f5f5f5; border-radius: 4px;">
          ${messageContent}
        </p>
        <p>Log in to your account to reply.</p>
      `,
    })

    console.log("Email sent successfully:", emailResponse)

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
