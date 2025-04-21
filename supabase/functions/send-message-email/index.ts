
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Make sure the API key is correctly loaded from environment variables
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  senderName: string;
  recipientEmail: string;
  recipientName: string;
  messagePreview: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log the API key presence (not the actual key for security)
    console.log(`RESEND_API_KEY available: ${!!resendApiKey}`);
    
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }

    const { senderName, recipientEmail, recipientName, messagePreview }: EmailRequest = await req.json();

    console.log(`Sending email notification to ${recipientEmail} from ${senderName}`);

    if (!recipientEmail) {
      throw new Error("Recipient email is required");
    }

    const { data, error } = await resend.emails.send({
      from: "ErasMatch <notifications@erasmatch.com>",
      to: [recipientEmail],
      subject: `New message from ${senderName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${recipientName}! 👋</h2>
          <p>You have a new message from <strong>${senderName}</strong>:</p>
          <div style="padding: 20px; background: #f5f5f5; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #666;">"${messagePreview}"</p>
          </div>
          <p>Login to <a href="https://erasmatch.com/messages">ErasMatch</a> to read and reply to this message.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #666; font-size: 0.9em;">
            You're receiving this because you have email notifications enabled for new messages on ErasMatch.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      throw error;
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-message-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send email notification",
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
