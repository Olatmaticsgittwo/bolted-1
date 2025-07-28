import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ConversionData {
  userId: string
  fromCurrency: string
  toCurrency: string
  amount: number
  exchangeRate: number
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

    const conversionData: ConversionData = await req.json()

    // Get user's current balance
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('usd_balance, btc_balance, eth_balance, usdt_balance, bnb_balance, ada_balance, sol_balance, dot_balance, matic_balance')
      .eq('user_id', conversionData.userId)
      .single()

    if (!profile) {
      throw new Error('User profile not found')
    }

    // Calculate conversion fee (1% of existing balance)
    const conversionFee = profile.usd_balance * 0.01
    const netAmount = conversionData.amount - conversionFee
    const convertedAmount = netAmount / conversionData.exchangeRate

    // Update balances
    const fromBalanceField = `${conversionData.fromCurrency.toLowerCase()}_balance`
    const toBalanceField = `${conversionData.toCurrency.toLowerCase()}_balance`

    const currentFromBalance = profile[fromBalanceField as keyof typeof profile] as number || 0
    const currentToBalance = profile[toBalanceField as keyof typeof profile] as number || 0

    if (currentFromBalance < conversionData.amount) {
      throw new Error('Insufficient balance')
    }

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        [fromBalanceField]: currentFromBalance - conversionData.amount,
        [toBalanceField]: currentToBalance + convertedAmount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', conversionData.userId)

    if (updateError) throw updateError

    // Record transaction
    const { data: transaction, error: txError } = await supabase
      .from('user_transactions')
      .insert({
        user_id: conversionData.userId,
        type: 'convert',
        coin: conversionData.toCurrency,
        amount: convertedAmount,
        usd_amount: conversionData.amount,
        status: 'completed',
        payment_method: 'conversion',
        fee_amount: conversionFee
      })
      .select()
      .single()

    if (txError) throw txError

    // Record conversion fee
    const { error: feeError } = await supabase
      .from('platform_fees')
      .insert({
        transaction_id: transaction.id,
        user_id: conversionData.userId,
        fee_type: 'conversion',
        fee_amount: conversionFee,
        fee_percentage: 0.01,
        original_amount: conversionData.amount
      })

    if (feeError) console.error('Fee recording error:', feeError)

    // Send notification email to admin
    const emailData = {
      to: 'bianotrades@hotmail.com',
      subject: `🔄 CURRENCY CONVERSION - ${conversionData.fromCurrency} to ${conversionData.toCurrency}`,
      html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .conversion-box { background: white; padding: 20px; border-left: 4px solid #17a2b8; margin: 20px 0; }
        .fee-box { background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔄 CURRENCY CONVERSION COMPLETED</h1>
        <p>BIANOTRADES Conversion System</p>
    </div>
    
    <div class="content">
        <div class="conversion-box">
            <h2>💱 Conversion Details</h2>
            <p><strong>Transaction ID:</strong> ${transaction.id}</p>
            <p><strong>User ID:</strong> ${conversionData.userId}</p>
            <p><strong>From:</strong> ${conversionData.amount} ${conversionData.fromCurrency}</p>
            <p><strong>To:</strong> ${convertedAmount.toFixed(8)} ${conversionData.toCurrency}</p>
            <p><strong>Exchange Rate:</strong> ${conversionData.exchangeRate}</p>
            <p><strong>Status:</strong> COMPLETED ✅</p>
            <p><strong>Processed:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="fee-box">
            <h3>💵 Conversion Fee Revenue</h3>
            <p><strong>Conversion Fee (1% of existing balance):</strong> $${conversionFee.toFixed(2)}</p>
            <p><strong>Net Amount Converted:</strong> $${netAmount.toFixed(2)}</p>
            <p><strong>Fee Percentage:</strong> 1.00% of existing USD balance</p>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>✅ Automatic Processing Complete</h3>
            <p>✓ User balances updated automatically</p>
            <p>✓ Conversion fee deducted and recorded</p>
            <p>✓ Transaction logged in system</p>
            <p>✓ No manual intervention required</p>
        </div>
    </div>
    
    <div class="footer">
        <p>BIANOTRADES Automated Conversion System</p>
        <p>This conversion was processed automatically</p>
    </div>
</body>
</html>
      `
    }

    console.log('=== CONVERSION COMPLETED ===')
    console.log('Transaction ID:', transaction.id)
    console.log('User ID:', conversionData.userId)
    console.log('From:', conversionData.amount, conversionData.fromCurrency)
    console.log('To:', convertedAmount, conversionData.toCurrency)
    console.log('Conversion Fee:', conversionFee)
    console.log('Email notification:', emailData)
    console.log('============================')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Conversion completed successfully',
        transactionId: transaction.id,
        convertedAmount: convertedAmount,
        conversionFee: conversionFee
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error processing conversion:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})