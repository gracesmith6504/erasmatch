
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the request body
    const { sender, receiver, message_text } = await req.json()

    // Validate required fields
    if (!sender || !receiver || !message_text) {
      console.error('Missing required fields:', { sender, receiver, message_text })
      return new Response(
        JSON.stringify({ error: 'sender, receiver and message_text are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Insert the message directly without any trigger dependencies
    const { data, error } = await supabaseClient
      .from('messages')
      .insert({
        sender_id: sender,
        receiver_id: receiver,
        content: message_text,
        read_by: []
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting message:', error)
      throw error
    }

    console.log('Message sent successfully:', data)

    return new Response(
      JSON.stringify({ success: true, message: data }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in send_message function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
