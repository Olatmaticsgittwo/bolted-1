import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Transaction {
  id: string
  user_email: string
  user_name: string
  user_phone: string
  transaction_type: 'buy' | 'sell'
  crypto_type: string
  amount: number
  usd_amount: number
  payment_method: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  stripe_payment_intent_id?: string
  wallet_address?: string
  transaction_hash?: string
  proof_of_transfer_url?: string
  payout_details?: any
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'new' | 'in_progress' | 'resolved'
  created_at: string
}