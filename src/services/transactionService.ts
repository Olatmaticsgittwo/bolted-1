import { supabase } from '../lib/supabase'

export interface CreateTransactionData {
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

export const createTransaction = async (data: CreateTransactionData) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-transaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to create transaction')
  }

  return response.json()
}

export const getTransactionById = async (id: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return data
}

export const getTransactionsByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_email', email)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}