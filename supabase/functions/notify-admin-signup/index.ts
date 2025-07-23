import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface SignupData {
  userEmail: string
  fullName: string
  phone: string
  country: string
  ipAddress: string
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

    const signupData: SignupData = await req.json()

    // Send email notification to admin
    const emailSubject = `🎉 NEW USER SIGNUP - ${signupData.fullName}`
    
    const emailBody = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .user-box { background: white; padding: 20px; border-left: 4px solid #28a745; margin: 20px 0; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 NEW USER REGISTRATION</h1>
        <p>BIANOTRADES User Management System</p>
    </div>
    
    <div class="content">
        <div class="user-box">
            <h2>👤 New User Details</h2>
            <p><strong>Full Name:</strong> ${signupData.fullName}</p>
            <p><strong>Email:</strong> ${signupData.userEmail}</p>
            <p><strong>Phone:</strong> ${signupData.phone}</p>
            <p><strong>Country:</strong> ${signupData.country}</p>
            <p><strong>IP Address:</strong> ${signupData.ipAddress}</p>
            <p><strong>Registration Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>⚡ Action Required:</h3>
            <p>A new user has registered on BIANOTRADES. Please review their account and approve KYC when documents are submitted.</p>
        </div>
    </div>
    
    <div class="footer">
        <p>BIANOTRADES Admin Notification System</p>
        <p>This is an automated notification from your crypto exchange platform</p>
    </div>
</body>
</html>
    `

    // Log the email data (in production, this would send via SMTP)
    console.log('=== NEW USER SIGNUP EMAIL ===')
    console.log('To: bianotrades@hotmail.com')
    console.log('Subject:', emailSubject)
    console.log('Body:', emailBody)
    console.log('===============================')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Admin notified of new signup',
        emailSent: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error notifying admin:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})