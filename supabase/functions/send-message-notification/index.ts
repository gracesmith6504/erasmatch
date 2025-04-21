
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase and Resend clients
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse incoming message data
    const { message_id, sender_id, receiver_id, content } = await req.json();

    // Fetch sender's profile
    const { data: senderProfile, error: senderError } = await supabase
      .from('profiles')
      .select('name, email')
      .eq('id', sender_id)
      .single();

    if (senderError) {
      console.error('Error fetching sender profile:', senderError);
      throw senderError;
    }

    // Fetch receiver's profile
    const { data: receiverProfile, error: receiverError } = await supabase
      .from('profiles')
      .select('name, email')
      .eq('id', receiver_id)
      .single();

    if (receiverError) {
      console.error('Error fetching receiver profile:', receiverError);
      throw receiverError;
    }

    // Send email notification
    const emailResponse = await resend.emails.send({
      from: 'Lovable <notifications@yourdomain.com>',
      to: [receiverProfile.email || ''],
      subject: `New Message from ${senderProfile.name || 'Someone'}`,
      html: `
        <h1>New Message</h1>
        <p>You have a new message from ${senderProfile.name || 'Someone'}:</p>
        <p>${content.slice(0, 200)}${content.length > 200 ? '...' : ''}</p>
        <p>Log in to see the full message.</p>
      `,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });

  } catch (error) {
    console.error('Error in send-message-notification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});
