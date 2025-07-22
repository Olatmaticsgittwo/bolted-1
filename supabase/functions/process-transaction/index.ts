import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface TransactionData {
  userEmail: string
  userName: string
  userPhone: string
  transactionType: 'buy' | 'sell'
  cryptoType: string
  amount: number
  usdAmount: number
  paymentMethod: string
  walletAddress?: string
  transactionHash?: string
  proofOfTransferUrl?: string
  payoutDetails?: any
  stripePaymentIntentId?: string
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

    const transactionData: TransactionData = await req.json()

    // Insert transaction into database
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_email: transactionData.userEmail,
        user_name: transactionData.userName,
        user_phone: transactionData.userPhone,
        transaction_type: transactionData.transactionType,
        crypto_type: transactionData.cryptoType,
        amount: transactionData.amount,
        usd_amount: transactionData.usdAmount,
        payment_method: transactionData.paymentMethod,
        wallet_address: transactionData.walletAddress,
        transaction_hash: transactionData.transactionHash,
        proof_of_transfer_url: transactionData.proofOfTransferUrl,
        payout_details: transactionData.payoutDetails,
        stripe_payment_intent_id: transactionData.stripePaymentIntentId,
        status: transactionData.transactionType === 'buy' ? 'processing' : 'pending'
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Send confirmation email to bianotrades@hotmail.com
    const emailData = {
      to: 'bianotrades@hotmail.com',
      subject: `New ${transactionData.transactionType.toUpperCase()} Order - ${data.id}`,
      html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .transaction-box { background: white; padding: 20px; border-left: 4px solid #28a745; margin: 20px 0; }
        .urgent { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>💰 NEW ${transactionData.transactionType.toUpperCase()} ORDER</h1>
        <p>BIANOTRADES Transaction Alert</p>
    </div>
    
    <div class="content">
        <div class="transaction-box">
            <h2>📋 Transaction Details</h2>
            <p><strong>Transaction ID:</strong> ${data.id}</p>
            <p><strong>Type:</strong> ${transactionData.transactionType.toUpperCase()}</p>
            <p><strong>Customer:</strong> ${transactionData.userName}</p>
            <p><strong>Email:</strong> ${transactionData.userEmail}</p>
            <p><strong>Phone:</strong> ${transactionData.userPhone}</p>
            <p><strong>Cryptocurrency:</strong> ${transactionData.cryptoType}</p>
            <p><strong>Amount:</strong> ${transactionData.amount} ${transactionData.cryptoType}</p>
            <p><strong>USD Value:</strong> $${transactionData.usdAmount.toLocaleString()}</p>
            <p><strong>Payment Method:</strong> ${transactionData.paymentMethod}</p>
            <p><strong>Status:</strong> ${data.status}</p>
            <p><strong>Created:</strong> ${new Date(data.created_at).toLocaleString()}</p>
            ${transactionData.walletAddress ? `<p><strong>Customer Wallet:</strong> ${transactionData.walletAddress}</p>` : ''}
            ${transactionData.payoutDetails ? `<p><strong>Payout Details:</strong> ${JSON.stringify(transactionData.payoutDetails)}</p>` : ''}
        </div>
        
        <div class="urgent">
            <h3>⚡ Action Required:</h3>
            ${transactionData.transactionType === 'buy' 
              ? `<p>Customer has placed a BUY order. Once payment is confirmed, send ${transactionData.amount} ${transactionData.cryptoType} to their wallet address.</p>`
              : `<p>Customer wants to SELL crypto. They will send ${transactionData.amount} ${transactionData.cryptoType} to your wallet. Verify the transaction and send payment via ${transactionData.paymentMethod}.</p>`
            }
            <p><strong>Delivery Promise:</strong> Complete within 3 hours as guaranteed!</p>
        </div>
    </div>
    
    <div class="footer">
        <p>BIANOTRADES Transaction Management System</p>
        <p>This is an automated notification from your crypto exchange platform</p>
    </div>
</body>
</html>
      `
    };
    
    console.log(`Transaction created: ${data.id} for ${transactionData.userEmail}`)
    console.log('Email notification data:', emailData)

    return new Response(
      JSON.stringify({
        success: true,
        transactionId: data.id,
        message: 'Transaction processed successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error processing transaction:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})