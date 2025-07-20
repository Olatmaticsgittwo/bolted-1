import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ContactMessage {
  name: string
  email: string
  subject: string
  message: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const messageData: ContactMessage = await req.json()

    // Insert contact message into database
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name: messageData.name,
        email: messageData.email,
        subject: messageData.subject,
        message: messageData.message,
        status: 'new'
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Send notification email to admin (you can integrate with your email service here)
    console.log(`New contact message: ${data.id} from ${messageData.email}`)

    return new Response(
      JSON.stringify({
        success: true,
        messageId: data.id,
        message: 'Contact message submitted successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error submitting contact message:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})