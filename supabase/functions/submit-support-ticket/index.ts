import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface TicketData {
  userId: string
  userEmail: string
  userName: string
  subject: string
  message: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const ticketData: TicketData = await req.json()

    // Insert support ticket
    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: ticketData.userId,
        subject: ticketData.subject,
        message: ticketData.message,
        status: 'open'
      })
      .select()
      .single()

    if (error) throw error

    // Send notification email to admin
    const emailData = {
      to: 'bianotrades@hotmail.com',
      subject: `🎫 NEW SUPPORT TICKET - ${ticketData.subject}`,
      html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .ticket-box { background: white; padding: 20px; border-left: 4px solid #ffc107; margin: 20px 0; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎫 NEW SUPPORT TICKET</h1>
        <p>BIANOTRADES Customer Support System</p>
    </div>
    
    <div class="content">
        <div class="ticket-box">
            <h2>📋 Ticket Details</h2>
            <p><strong>Ticket ID:</strong> ${ticket.id}</p>
            <p><strong>User:</strong> ${ticketData.userName}</p>
            <p><strong>Email:</strong> ${ticketData.userEmail}</p>
            <p><strong>Subject:</strong> ${ticketData.subject}</p>
            <p><strong>Status:</strong> OPEN</p>
            <p><strong>Created:</strong> ${new Date(ticket.created_at).toLocaleString()}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>💬 Message:</h3>
            <p style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 3px solid #007bff;">
              ${ticketData.message}
            </p>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>⚡ Action Required:</h3>
            <p>A customer has submitted a new support ticket. Please respond within 24 hours.</p>
            <p>Customer expects a response at: <strong>${ticketData.userEmail}</strong></p>
        </div>
    </div>
    
    <div class="footer">
        <p>BIANOTRADES Customer Support System</p>
        <p>This is an automated notification from your support ticket system</p>
    </div>
</body>
</html>
      `
    }

    console.log('=== SUPPORT TICKET SUBMITTED ===')
    console.log('Ticket ID:', ticket.id)
    console.log('User:', ticketData.userName)
    console.log('Email:', ticketData.userEmail)
    console.log('Subject:', ticketData.subject)
    console.log('Email notification:', emailData)
    console.log('=================================')

    return new Response(
      JSON.stringify({
        success: true,
        ticketId: ticket.id,
        message: 'Support ticket submitted successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error submitting support ticket:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})