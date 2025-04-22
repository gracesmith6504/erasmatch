
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface MessageNotification {
  message_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message_id, sender_id, receiver_id, content }: MessageNotification = await req.json();
    console.log("Received message notification request:", { message_id, sender_id, receiver_id });

    // Create Supabase client with service role key to bypass RLS
    const supabaseUrl = 'https://ceoflcktscennfmmdrvp.supabase.co';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // Get sender and receiver profiles
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id, name, email')
      .in('id', [sender_id, receiver_id]);

    if (profilesError) {
      throw new Error(`Error fetching profiles: ${profilesError.message}`);
    }

    const sender = profiles.find(p => p.id === sender_id);
    const receiver = profiles.find(p => p.id === receiver_id);

    if (!sender || !receiver || !receiver.email) {
      throw new Error('Could not find sender or receiver profiles');
    }

    const truncatedContent = content.length > 100 ? 
      content.substring(0, 100) + '...' : 
      content;

    console.log("Sending email to:", receiver.email);
    const emailResponse = await resend.emails.send({
      from: "ErasMatch Team <team@erasmatch.com>",
      to: [receiver.email],
      subject: "You received a message on ErasMatch",
      html: `
        <h1>New Message on ErasMatch</h1>
        <p>Hi ${receiver.name || 'there'},</p>
        <p>You got a message from ${sender.name || 'another user'}:</p>
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
