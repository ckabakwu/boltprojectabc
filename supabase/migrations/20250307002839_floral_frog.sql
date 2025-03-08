/*
  # Create Temporary Credentials Table

  1. New Tables
    - `temp_credentials`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `temp_password` (text)
      - `expires_at` (timestamptz)
      - `used` (boolean)
      - `created_at` (timestamptz)
      - `created_by` (uuid, references users)

  2. Security
    - Enable RLS
    - Add policy for admin access
    - Add policy for user access to own credentials
*/

CREATE TABLE IF NOT EXISTS temp_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  temp_password text NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

-- Enable RLS
ALTER TABLE temp_credentials ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Admin users can manage temp credentials"
  ON temp_credentials
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create policy for users to view their own credentials
CREATE POLICY "Users can view their own temp credentials"
  ON temp_credentials
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create index for faster lookups
CREATE INDEX idx_temp_credentials_user_id ON temp_credentials(user_id);
CREATE INDEX idx_temp_credentials_expires_at ON temp_credentials(expires_at);