/*
  # Create temporary admin credentials system

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
    - Enable RLS on temp_credentials table
    - Add policies for admin access and user viewing

  3. Indexes
    - Create indexes for user_id and expires_at columns
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

-- Create temporary admin user if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'admin@homemaidy.com'
  ) THEN
    INSERT INTO users (id, email, full_name, role, status)
    VALUES (
      'temp-admin-id',
      'admin@homemaidy.com',
      'Temporary Admin',
      'admin',
      'active'
    );

    INSERT INTO temp_credentials (user_id, temp_password, expires_at, created_by)
    VALUES (
      'temp-admin-id',
      'Admin123!@#',
      now() + interval '7 days',
      'temp-admin-id'
    );
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_temp_credentials_user_id ON temp_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_temp_credentials_expires_at ON temp_credentials(expires_at);