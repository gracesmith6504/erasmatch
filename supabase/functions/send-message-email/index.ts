
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface MessageNotification {
  message_id?: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  senderName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sender_id, receiver_id, content, senderName }: MessageNotification = await req.json();
    console.log("Received message notification request:", { sender_id, receiver_id });

    // Create Supabase client with service role key to bypass RLS
    const supabaseUrl = 'https://ceoflcktscennfmmdrvp.supabase.co';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // Get receiver profile (we already have sender info from the frontend)
    const { data: receiverProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('name, email')
      .eq('id', receiver_id)
      .single();

    if (profileError) {
      throw new Error(`Error fetching receiver profile: ${profileError.message}`);
    }

    if (!receiverProfile || !receiverProfile.email) {
      throw new Error('Could not find receiver profile or email');
    }

    const truncatedContent = content.length > 100 ? 
      content.substring(0, 100) + '...' : 
      content;

    console.log("Sending email to:", receiverProfile.email);
    const emailResponse = await resend.emails.send({
      from: "ErasMatch Team <team@erasmatch.com>",
      to: [receiverProfile.email],
      subject: "You received a message on ErasMatch",
      html: `
        <h1>New Message on ErasMatch</h1>
        <p>Hi ${receiverProfile.name || 'there'},</p>
        <p>You got a message from ${senderName || 'another user'}:</p>
        <p style="padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
          "${truncatedContent}"
        </p>
        <p><a href="https://erasmatch.com/messages" style="color: #0066cc;">View it on ErasMatch</a></p>
        <p>Best regards,<br>The ErasMatch Team</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in send-message-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
