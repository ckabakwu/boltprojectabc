/*
  # Create Temporary Credentials System

  1. New Tables
    - `temp_credentials`
      - Stores temporary login credentials
      - Includes expiry and usage tracking
      - Links to users table

  2. Security
    - Enable RLS
    - Add policies for admin access
    - Add policies for user access

  3. Indexes
    - Add indexes for efficient querying
*/

-- Create temp_credentials table if it doesn't exist
CREATE TABLE IF NOT EXISTS temp_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  temp_password text NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

-- Enable RLS
ALTER TABLE temp_credentials ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Admins can manage all temp credentials" ON temp_credentials;
  DROP POLICY IF EXISTS "Users can view their own temp credentials" ON temp_credentials;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Recreate policies
CREATE POLICY "Admins can manage all temp credentials"
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

CREATE POLICY "Users can view their own temp credentials"
  ON temp_credentials
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_temp_credentials_user_id ON temp_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_temp_credentials_expires_at ON temp_credentials(expires_at);
CREATE INDEX IF NOT EXISTS idx_temp_credentials_lookup ON temp_credentials(temp_password, used) WHERE (used = false);