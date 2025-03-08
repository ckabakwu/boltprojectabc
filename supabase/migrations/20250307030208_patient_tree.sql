/*
  # Create Temporary Credentials System
  
  1. New Tables
    - temp_credentials: Stores temporary admin credentials
    
  2. Security
    - Enable RLS
    - Add policies for admin access
    - Add audit logging
*/

-- Create temp_credentials table if not exists
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

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Admins can manage temp credentials" ON temp_credentials;

-- Create policy
CREATE POLICY "Admins can manage temp credentials"
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_temp_credentials_user_id ON temp_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_temp_credentials_expires_at ON temp_credentials(expires_at);

-- Create initial admin user if not exists
DO $$ 
DECLARE
  admin_id uuid;
BEGIN
  -- Create admin user
  INSERT INTO users (
    id,
    email,
    full_name,
    role
  ) VALUES (
    gen_random_uuid(),
    'admin@homemaidy.com',
    'System Administrator',
    'admin'
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO admin_id;

  -- If admin was created, create temp credentials
  IF admin_id IS NOT NULL THEN
    INSERT INTO temp_credentials (
      user_id,
      temp_password,
      expires_at,
      created_by
    ) VALUES (
      admin_id,
      'Admin123!@#',
      now() + interval '48 hours',
      admin_id
    );

    -- Log the creation
    INSERT INTO audit_log (
      user_id,
      action,
      table_name,
      record_id,
      metadata
    ) VALUES (
      admin_id,
      'create_temp_admin',
      'users',
      admin_id,
      jsonb_build_object(
        'expires_at', now() + interval '48 hours',
        'environment', 'development'
      )
    );
  END IF;
END $$;