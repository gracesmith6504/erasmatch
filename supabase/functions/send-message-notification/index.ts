
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string
  senderName: string
  messageContent: string
  receiverId: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { to, senderName, messageContent, receiverId }: EmailRequest = await req.json()

    // Check receiver's email notification preference
    if (receiverId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      const supabase = createClient(supabaseUrl, supabaseServiceKey)

      const { data: profile } = await supabase
        .from('profiles')
        .select('email_notifications')
        .eq('id', receiverId)
        .single()

      if (profile && profile.email_notifications === false) {
        console.log("Email notifications disabled for user:", receiverId)
        return new Response(JSON.stringify({ skipped: true, reason: "notifications_disabled" }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    const emailResponse = await resend.emails.send({
      from: "ErasMatch <team@erasmatch.com>",
      to: [to],
      subject: `New message from ${senderName}`,
      html: `
        <h2>You have a new message from ${senderName}</h2>
        <p style="margin: 16px 0; padding: 12px; background-color: #f5f5f5; border-radius: 4px;">
          ${messageContent}
        </p>
        <a href="https://erasmatch.com/messages" style="display:inline-block;background-color:#4F46E5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;margin:16px 0;">Reply on ErasMatch →</a>
        <p style="color:#9CA3AF;font-size:12px;margin-top:24px;">You received this because you have an ErasMatch account. <a href="https://erasmatch.com/profile" style="color:#9CA3AF;">Unsubscribe from email notifications</a></p>
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
