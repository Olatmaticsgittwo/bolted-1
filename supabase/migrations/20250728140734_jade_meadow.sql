/*
  # Additional tables for enhanced crypto dashboard

  1. New Tables
    - `wallet_addresses` - Admin-managed deposit addresses
    - `support_tickets` - User support tickets
    - `conversion_fees` - Track conversion fees
    - `platform_fees` - Track platform fees

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies

  3. Indexes
    - Performance indexes on frequently queried columns
*/

-- Wallet Addresses Table (Admin managed)
CREATE TABLE IF NOT EXISTS wallet_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coin text NOT NULL,
  network text NOT NULL,
  address text NOT NULL UNIQUE,
  qr_code text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Support Tickets Table
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  admin_response text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Platform Fees Table
CREATE TABLE IF NOT EXISTS platform_fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  fee_type text NOT NULL CHECK (fee_type IN ('platform', 'conversion', 'withdrawal')),
  fee_amount numeric(12,2) NOT NULL,
  fee_percentage numeric(5,4),
  original_amount numeric(12,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add additional columns to user_transactions for enhanced tracking
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_transactions' AND column_name = 'fee_amount'
  ) THEN
    ALTER TABLE user_transactions ADD COLUMN fee_amount numeric(12,2) DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_transactions' AND column_name = 'recipient_wallet'
  ) THEN
    ALTER TABLE user_transactions ADD COLUMN recipient_wallet text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_transactions' AND column_name = 'recipient_name'
  ) THEN
    ALTER TABLE user_transactions ADD COLUMN recipient_name text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_transactions' AND column_name = 'recipient_email'
  ) THEN
    ALTER TABLE user_transactions ADD COLUMN recipient_email text;
  END IF;
END $$;

-- Add more crypto balance columns to user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'bnb_balance'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN bnb_balance numeric(18,8) DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'ada_balance'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN ada_balance numeric(18,8) DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'sol_balance'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN sol_balance numeric(18,8) DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'dot_balance'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN dot_balance numeric(18,8) DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'matic_balance'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN matic_balance numeric(18,8) DEFAULT 0;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE wallet_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_fees ENABLE ROW LEVEL SECURITY;

-- Policies for wallet_addresses (public read)
CREATE POLICY "Anyone can view wallet addresses"
  ON wallet_addresses
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Policies for support_tickets
CREATE POLICY "Users can view own tickets"
  ON support_tickets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets"
  ON support_tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for platform_fees
CREATE POLICY "Users can view own fees"
  ON platform_fees
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_wallet_addresses_coin ON wallet_addresses(coin);
CREATE INDEX IF NOT EXISTS idx_wallet_addresses_active ON wallet_addresses(is_active);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_platform_fees_user_id ON platform_fees(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_fees_transaction_id ON platform_fees(transaction_id);

-- Insert sample wallet addresses
INSERT INTO wallet_addresses (coin, network, address) VALUES
  ('BTC', 'Bitcoin', '36Ds3LNDjmRMHDk2Y5r9vWbjTFUCTezruY'),
  ('ETH', 'Ethereum', '0x6aa8f55a05af72f6bc98c72863fa955e6fc8e928'),
  ('USDT', 'Tron (TRC20)', 'TEbbs4roSj2CdGqKzNvZHCXGv58Yzhv127'),
  ('BNB', 'Binance Smart Chain', 'bnb1234567890abcdef'),
  ('ADA', 'Cardano', 'addr1234567890abcdef'),
  ('SOL', 'Solana', 'sol1234567890abcdef')
ON CONFLICT (address) DO NOTHING;