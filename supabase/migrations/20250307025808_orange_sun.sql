/*
  # Admin System Reset and Temporary Credentials

  1. New Tables
    - temp_credentials: Stores temporary admin credentials
    - auth_backup: Backup of auth data
  
  2. Security
    - Enable RLS
    - Add policies for admin access
    - Add audit logging
*/

-- Create backup table for existing auth data
CREATE TABLE IF NOT EXISTS auth_backup_20250307 (
  id uuid,
  email text,
  encrypted_password text,
  created_at timestamptz,
  updated_at timestamptz
);

-- Create temp_credentials table
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage temp credentials" ON temp_credentials;
DROP POLICY IF EXISTS "Users can view their own temp credentials" ON temp_credentials;

-- Create policies
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

CREATE POLICY "Users can view their own temp credentials"
  ON temp_credentials
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_temp_credentials_user_id ON temp_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_temp_credentials_expires_at ON temp_credentials(expires_at);

-- Create cleanup function
CREATE OR REPLACE FUNCTION cleanup_expired_temp_credentials()
RETURNS void AS $$
BEGIN
  UPDATE temp_credentials
  SET used = true
  WHERE expires_at < now() AND used = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create temporary admin user
DO $$ 
DECLARE
  temp_user_id uuid;
BEGIN
  -- Create user profile first
  INSERT INTO users (
    id,
    email,
    full_name,
    role
  ) VALUES (
    gen_random_uuid(),
    'admin@homemaidy.com',
    'Temporary Administrator',
    'admin'
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO temp_user_id;

  -- If user was created, create temp credentials
  IF temp_user_id IS NOT NULL THEN
    INSERT INTO temp_credentials (
      user_id,
      temp_password,
      expires_at,
      created_by
    ) VALUES (
      temp_user_id,
      'Admin123!@#',
      now() + interval '48 hours',
      temp_user_id
    );

    -- Log the creation
    INSERT INTO audit_log (
      user_id,
      action,
      table_name,
      record_id,
      metadata
    ) VALUES (
      temp_user_id,
      'create_temp_admin',
      'users',
      temp_user_id,
      jsonb_build_object(
        'expires_at', now() + interval '48 hours',
        'environment', 'development'
      )
    );

    -- Output credentials
    RAISE NOTICE 'Temporary admin credentials created:';
    RAISE NOTICE 'Email: admin@homemaidy.com';
    RAISE NOTICE 'Password: Admin123!@#';
    RAISE NOTICE 'Valid until: %', (now() + interval '48 hours');
  END IF;
END $$;