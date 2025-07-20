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

    // Send confirmation email (you can integrate with your email service here)
    console.log(`Transaction created: ${data.id} for ${transactionData.userEmail}`)

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