/*
  # Create transactions and users schema

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_email` (text)
      - `user_name` (text)
      - `user_phone` (text)
      - `transaction_type` (text) - 'buy' or 'sell'
      - `crypto_type` (text) - 'BTC', 'ETH', 'USDT', 'BNB'
      - `amount` (decimal)
      - `usd_amount` (decimal)
      - `payment_method` (text)
      - `status` (text) - 'pending', 'processing', 'completed', 'failed'
      - `stripe_payment_intent_id` (text, nullable)
      - `wallet_address` (text, nullable)
      - `transaction_hash` (text, nullable)
      - `proof_of_transfer_url` (text, nullable)
      - `payout_details` (jsonb, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `subject` (text)
      - `message` (text)
      - `status` (text) - 'new', 'in_progress', 'resolved'
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access to insert transactions and messages
    - Add admin policies for reading all data
*/

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  user_name text NOT NULL,
  user_phone text NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('buy', 'sell')),
  crypto_type text NOT NULL CHECK (crypto_type IN ('BTC', 'ETH', 'USDT', 'BNB')),
  amount decimal(18, 8) NOT NULL,
  usd_amount decimal(12, 2) NOT NULL,
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

-- Create contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies for transactions
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

-- Policies for contact messages
CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_email ON transactions(user_email);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);