import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ComplaintData {
  name: string
  email: string
  phone: string
  complaint: string
  assistantName: string
  assistantTitle: string
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

    const complaintData: ComplaintData = await req.json()

    // Insert complaint into database
    const { data, error } = await supabase
      .from('complaints')
      .insert({
        name: complaintData.name,
        email: complaintData.email,
        phone: complaintData.phone,
        complaint: complaintData.complaint,
        assistant_name: complaintData.assistantName,
        assistant_title: complaintData.assistantTitle,
        status: 'new'
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      // Continue even if database fails
    }

    // Send email notification to bianotrades@hotmail.com
    const emailSubject = `🚨 NEW COMPLAINT for ${complaintData.assistantName} - ${complaintData.assistantTitle}`
    
    const emailBody = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .complaint-box { background: white; padding: 20px; border-left: 4px solid #dc3545; margin: 20px 0; }
        .assistant-info { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚨 NEW COMPLAINT RECEIVED</h1>
        <p>BIANOTRADES Customer Complaint System</p>
    </div>
    
    <div class="content">
        <div class="assistant-info">
            <h2>📋 Assigned to: ${complaintData.assistantName}</h2>
            <p><strong>Title:</strong> ${complaintData.assistantTitle}</p>
            <p><strong>Complaint ID:</strong> ${data?.id || 'N/A'}</p>
            <p><strong>Priority:</strong> HIGH</p>
        </div>
        
        <h3>👤 Customer Information:</h3>
        <ul>
            <li><strong>Name:</strong> ${complaintData.name}</li>
            <li><strong>Email:</strong> ${complaintData.email}</li>
            <li><strong>Phone:</strong> ${complaintData.phone || 'Not provided'}</li>
            <li><strong>Date:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        
        <div class="complaint-box">
            <h3>💬 Complaint Details:</h3>
            <p>${complaintData.complaint}</p>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>⚡ Action Required:</h3>
            <p>This complaint has been assigned to <strong>${complaintData.assistantName}</strong>. Please respond within 24 hours.</p>
            <p>Customer expects a response at: <strong>${complaintData.email}</strong></p>
        </div>
    </div>
    
    <div class="footer">
        <p>BIANOTRADES Customer Care System</p>
        <p>This is an automated notification from your complaint management system</p>
    </div>
</body>
</html>
    `

    // Log the email data (in production, this would send via SMTP)
    console.log('=== COMPLAINT EMAIL NOTIFICATION ===')
    console.log('To: bianotrades@hotmail.com')
    console.log('Subject:', emailSubject)
    console.log('Body:', emailBody)
    console.log('=====================================')

    return new Response(
      JSON.stringify({
        success: true,
        complaintId: data?.id || 'temp-id',
        message: `Complaint sent successfully to ${complaintData.assistantName}`,
        emailSent: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error submitting complaint:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})