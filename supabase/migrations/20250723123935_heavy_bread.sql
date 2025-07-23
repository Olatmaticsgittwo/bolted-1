/*
  # Complete User Management System

  1. New Tables
    - `user_profiles` - Extended user information and balances
    - `user_transactions` - All user trading transactions
    - `deposit_requests` - User deposit requests with proof
    - `kyc_documents` - KYC verification documents

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    - Admin access policies

  3. Features
    - User authentication integration
    - Balance management
    - Transaction history
    - KYC verification system
    - Deposit approval workflow
*/

-- User Profiles Table (Extended)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  phone text,
  country text,
  ip_address text,
  avatar_url text,
  kyc_status text DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'denied')),
  tier text DEFAULT 'basic' CHECK (tier IN ('basic', 'advanced')),
  btc_balance numeric(18,8) DEFAULT 0,
  eth_balance numeric(18,8) DEFAULT 0,
  usdt_balance numeric(18,8) DEFAULT 0,
  usd_balance numeric(12,2) DEFAULT 0,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Transactions Table
CREATE TABLE IF NOT EXISTS user_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('buy', 'sell', 'deposit', 'withdrawal')),
  coin text NOT NULL,
  amount numeric(18,8) NOT NULL,
  usd_amount numeric(12,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payment_method text,
  transaction_hash text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Deposit Requests Table
CREATE TABLE IF NOT EXISTS deposit_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  method text NOT NULL CHECK (method IN ('paypal', 'cashapp', 'wire', 'crypto')),
  amount numeric(12,2) NOT NULL,
  proof_url text,
  reference_code text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

-- KYC Documents Table
CREATE TABLE IF NOT EXISTS kyc_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('passport', 'drivers_license', 'id_card')),
  document_url text NOT NULL,
  selfie_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert profiles"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- User Transactions Policies
CREATE POLICY "Users can view own transactions"
  ON user_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert transactions"
  ON user_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Deposit Requests Policies
CREATE POLICY "Users can view own deposits"
  ON deposit_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create deposit requests"
  ON deposit_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- KYC Documents Policies
CREATE POLICY "Users can view own KYC documents"
  ON kyc_documents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload KYC documents"
  ON kyc_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_kyc_status ON user_profiles(kyc_status);

CREATE INDEX IF NOT EXISTS idx_user_transactions_user_id ON user_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_transactions_created_at ON user_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_user_transactions_status ON user_transactions(status);

CREATE INDEX IF NOT EXISTS idx_deposit_requests_user_id ON deposit_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_deposit_requests_status ON deposit_requests(status);
CREATE INDEX IF NOT EXISTS idx_deposit_requests_created_at ON deposit_requests(created_at);

CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id ON kyc_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_status ON kyc_documents(status);