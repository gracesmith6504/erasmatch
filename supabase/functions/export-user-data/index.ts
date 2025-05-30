
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the user that called the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get the session or user object
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { userId, format } = await req.json()

    // Verify the user can only export their own data
    if (user.id !== userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized access to user data' }),
        { 
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Fetch user profile data
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
    }

    // Fetch direct messages
    const { data: messages, error: messagesError } = await supabaseClient
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (messagesError) {
      console.error('Error fetching messages:', messagesError)
    }

    // Fetch city messages
    const { data: cityMessages, error: cityMessagesError } = await supabaseClient
      .from('city_messages')
      .select('*')
      .eq('sender_id', userId)
      .order('created_at', { ascending: false })

    if (cityMessagesError) {
      console.error('Error fetching city messages:', cityMessagesError)
    }

    // Fetch group messages
    const { data: groupMessages, error: groupMessagesError } = await supabaseClient
      .from('group_messages')
      .select('*')
      .eq('sender_id', userId)
      .order('created_at', { ascending: false })

    if (groupMessagesError) {
      console.error('Error fetching group messages:', groupMessagesError)
    }

    // Compile all user data
    const userData = {
      exportDate: new Date().toISOString(),
      exportFormat: format,
      profile: profile || {},
      directMessages: messages || [],
      cityMessages: cityMessages || [],
      groupMessages: groupMessages || [],
      summary: {
        totalDirectMessages: messages?.length || 0,
        totalCityMessages: cityMessages?.length || 0,
        totalGroupMessages: groupMessages?.length || 0
      }
    }

    let content: string
    let contentType: string

    if (format === 'csv') {
      // Convert to CSV format
      content = convertToCSV(userData)
      contentType = 'text/csv'
    } else {
      // Default to JSON
      content = JSON.stringify(userData, null, 2)
      contentType = 'application/json'
    }

    return new Response(
      JSON.stringify({ content }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in export-user-data function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function convertToCSV(userData: any): string {
  const lines: string[] = []
  
  // Profile data
  lines.push('PROFILE DATA')
  lines.push('Field,Value')
  const profile = userData.profile
  Object.keys(profile).forEach(key => {
    const value = profile[key]
    lines.push(`${key},"${value || ''}"`)
  })
  
  lines.push('')
  lines.push('DIRECT MESSAGES')
  lines.push('Date,Sender ID,Receiver ID,Content')
  userData.directMessages.forEach((msg: any) => {
    lines.push(`${msg.created_at},"${msg.sender_id}","${msg.receiver_id}","${msg.content || ''}"`)
  })
  
  lines.push('')
  lines.push('CITY MESSAGES')
  lines.push('Date,City,Content')
  userData.cityMessages.forEach((msg: any) => {
    lines.push(`${msg.created_at},"${msg.city_name}","${msg.content || ''}"`)
  })
  
  lines.push('')
  lines.push('GROUP MESSAGES')
  lines.push('Date,University,Content')
  userData.groupMessages.forEach((msg: any) => {
    lines.push(`${msg.created_at},"${msg.university_name}","${msg.content || ''}"`)
  })
  
  return lines.join('\n')
}
