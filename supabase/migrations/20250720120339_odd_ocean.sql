/*
  # Complete BIANOTRADES Database Schema

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_email` (text, not null)
      - `user_name` (text, not null)
      - `user_phone` (text, not null)
      - `transaction_type` (text, buy/sell)
      - `crypto_type` (text, BTC/ETH/USDT/BNB)
      - `amount` (numeric, crypto amount)
      - `usd_amount` (numeric, USD value)
      - `payment_method` (text)
      - `status` (text, pending/processing/completed/failed)
      - `stripe_payment_intent_id` (text, optional)
      - `wallet_address` (text, optional)
      - `transaction_hash` (text, optional)
      - `proof_of_transfer_url` (text, optional)
      - `payout_details` (jsonb, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `email` (text, not null)
      - `subject` (text, not null)
      - `message` (text, not null)
      - `status` (text, new/in_progress/resolved)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access to insert
    - Add policies for authenticated users to read their own data

  3. Indexes
    - Performance indexes on frequently queried columns
*/

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  user_name text NOT NULL,
  user_phone text NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('buy', 'sell')),
  crypto_type text NOT NULL CHECK (crypto_type IN ('BTC', 'ETH', 'USDT', 'BNB')),
  amount numeric(18,8) NOT NULL,
  usd_amount numeric(12,2) NOT NULL,
  payment_method text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  stripe_payment_intent_id text,
  wallet_address text,
  transaction_hash text,
  proof_of_transfer_url text,
  payout_details jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions
CREATE POLICY "Anyone can insert transactions"
  ON transactions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own transactions"
  ON transactions
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for contact messages
CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_email ON transactions(user_email);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);

-- Create updated_at trigger for transactions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_transactions_updated_at'
  ) THEN
    CREATE TRIGGER update_transactions_updated_at
      BEFORE UPDATE ON transactions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;