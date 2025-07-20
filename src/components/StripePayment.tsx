import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { createPaymentIntent } from '../lib/stripe'
import { CreditCard, Loader } from 'lucide-react'

interface StripePaymentProps {
  amount: number
  currency: string
  transactionId: string
  customerEmail: string
  customerName: string
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
}

export function StripePayment({
  amount,
  currency,
  transactionId,
  customerEmail,
  customerName,
  onSuccess,
  onError
}: StripePaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)
    
    try {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
      
      if (!stripe) {
        throw new Error('Stripe failed to load')
      }

      // Create payment intent
      const { clientSecret, paymentIntentId } = await createPaymentIntent(
        amount,
        currency,
        transactionId,
        customerEmail,
        customerName
      )

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: clientSecret
      })

      if (error) {
        throw new Error(error.message)
      }

      onSuccess(paymentIntentId)
    } catch (error) {
      console.error('Payment error:', error)
      onError(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900">Credit Card Payment</h3>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="font-semibold">${amount.toFixed(2)} {currency.toUpperCase()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Customer:</span>
            <span className="font-semibold">{customerName}</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5" />
              Pay with Stripe
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Secure payment powered by Stripe. Your payment information is encrypted and secure.
        </p>
      </div>
    </div>
  )
}