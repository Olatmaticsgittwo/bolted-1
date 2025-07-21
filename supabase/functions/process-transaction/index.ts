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
        <h2>New Transaction Alert</h2>
        <p><strong>Transaction ID:</strong> ${data.id}</p>
        <p><strong>Type:</strong> ${transactionData.transactionType.toUpperCase()}</p>
        <p><strong>Customer:</strong> ${transactionData.userName}</p>
        <p><strong>Email:</strong> ${transactionData.userEmail}</p>
        <p><strong>Phone:</strong> ${transactionData.userPhone}</p>
        <p><strong>Cryptocurrency:</strong> ${transactionData.cryptoType}</p>
        <p><strong>Amount:</strong> ${transactionData.amount} ${transactionData.cryptoType}</p>
        <p><strong>USD Value:</strong> $${transactionData.usdAmount}</p>
        <p><strong>Payment Method:</strong> ${transactionData.paymentMethod}</p>
        <p><strong>Status:</strong> ${data.status}</p>
        <p><strong>Created:</strong> ${new Date(data.created_at).toLocaleString()}</p>
        ${transactionData.walletAddress ? `<p><strong>Customer Wallet:</strong> ${transactionData.walletAddress}</p>` : ''}
        ${transactionData.payoutDetails ? `<p><strong>Payout Details:</strong> ${JSON.stringify(transactionData.payoutDetails)}</p>` : ''}
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