/*
  # Admin Authentication System
  
  1. New Tables
    - temp_admin_auth: Stores temporary admin credentials
    
  2. Security
    - Enable RLS
    - Add policies for admin access
    - Add audit logging
*/

-- Create temp admin auth table
CREATE TABLE IF NOT EXISTS temp_admin_auth (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  password_hash text NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '48 hours'),
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT temp_admin_auth_email_key UNIQUE (email)
);

-- Enable RLS
ALTER TABLE temp_admin_auth ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Only admins can access temp auth"
  ON temp_admin_auth
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create function to validate temp admin credentials
CREATE OR REPLACE FUNCTION validate_temp_admin_auth(
  p_email text,
  p_password text
) RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM temp_admin_auth
    WHERE email = p_email
    AND password_hash = crypt(p_password, password_hash)
    AND NOT used
    AND expires_at > now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create initial admin user
DO $$ 
DECLARE
  v_email text := 'admin@homemaidy.com';
  v_password text := 'Admin123!@#';
  v_user_id uuid;
BEGIN
  -- Create admin user if not exists
  INSERT INTO users (
    id,
    email,
    full_name,
    role
  ) VALUES (
    gen_random_uuid(),
    v_email,
    'System Administrator',
    'admin'
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO v_user_id;

  -- Create temporary admin credentials
  IF v_user_id IS NOT NULL THEN
    INSERT INTO temp_admin_auth (
      email,
      password_hash,
      expires_at
    ) VALUES (
      v_email,
      crypt(v_password, gen_salt('bf')),
      now() + interval '48 hours'
    )
    ON CONFLICT (email) DO UPDATE
    SET 
      password_hash = crypt(v_password, gen_salt('bf')),
      expires_at = now() + interval '48 hours',
      used = false;

    -- Log credential creation
    INSERT INTO audit_log (
      user_id,
      action,
      table_name,
      record_id,
      metadata
    ) VALUES (
      v_user_id,
      'create_temp_admin',
      'temp_admin_auth',
      v_user_id,
      jsonb_build_object(
        'email', v_email,
        'expires_at', (now() + interval '48 hours')
      )
    );
  END IF;
END $$;

-- Create function to cleanup expired credentials
CREATE OR REPLACE FUNCTION cleanup_expired_temp_auth()
RETURNS void AS $$
BEGIN
  UPDATE temp_admin_auth
  SET used = true
  WHERE expires_at < now() AND NOT used;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically cleanup expired credentials
CREATE OR REPLACE FUNCTION trigger_cleanup_expired_temp_auth()
RETURNS trigger AS $$
BEGIN
  PERFORM cleanup_expired_temp_auth();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cleanup_expired_temp_auth_trigger
  AFTER INSERT OR UPDATE ON temp_admin_auth
  EXECUTE FUNCTION trigger_cleanup_expired_temp_auth();