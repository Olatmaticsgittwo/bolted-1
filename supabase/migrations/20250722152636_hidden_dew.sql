/*
  # Add complaints table for customer complaint system

  1. New Tables
    - `complaints`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text, optional)
      - `complaint` (text)
      - `assistant_name` (text)
      - `assistant_title` (text)
      - `status` (text, default 'new')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `complaints` table
    - Add policy for anyone to insert complaints
*/

CREATE TABLE IF NOT EXISTS complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  complaint text NOT NULL,
  assistant_name text NOT NULL,
  assistant_title text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert complaints"
  ON complaints
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX idx_complaints_created_at ON complaints (created_at);
CREATE INDEX idx_complaints_status ON complaints (status);