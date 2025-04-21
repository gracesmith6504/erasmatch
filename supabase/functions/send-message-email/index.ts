
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": 
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { senderName, recipientId, messageContent } = await req.json();

    // Get recipient's email from profiles table
    const { data: recipientData, error: recipientError } = await req.supabase
      .from("profiles")
      .select("email, name")
      .eq("id", recipientId)
      .single();

    if (recipientError || !recipientData?.email) {
      throw new Error("Could not find recipient email");
    }

    const emailResponse = await resend.emails.send({
      from: "ErasMatch <onboarding@resend.dev>",
      to: recipientData.email,
      subject: `New message from ${senderName}`,
      html: `
        <div>
          <h2>You have a new message on ErasMatch!</h2>
          <p><strong>${senderName}</strong> sent you a message:</p>
          <p style="padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
            "${messageContent}"
          </p>
          <p>Log in to <a href="https://erasmatch.com">ErasMatch</a> to reply!</p>
        </div>
      `,
    });

    console.log("Email notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending email notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
