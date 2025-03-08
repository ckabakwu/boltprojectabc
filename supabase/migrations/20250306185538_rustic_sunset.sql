/*
  # Authentication Tables Migration

  1. New Tables
    - two_factor_auth: Stores 2FA settings and backup codes
    - account_creation_log: Tracks new account creation

  2. Security
    - Enables RLS on all tables
    - Adds policies for data access
    - Implements 2FA requirement for admins

  3. Changes
    - Adds default admin account
    - Adds password validation
*/

-- Add two-factor authentication table
CREATE TABLE IF NOT EXISTS two_factor_auth (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users NOT NULL,
  enabled boolean DEFAULT false,
  secret text,
  backup_codes text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Add account creation log table
CREATE TABLE IF NOT EXISTS account_creation_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users NOT NULL,
  created_by uuid REFERENCES users,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE two_factor_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_creation_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for two_factor_auth
CREATE POLICY "Users can view their own 2FA settings"
  ON two_factor_auth
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own 2FA settings"
  ON two_factor_auth
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for account_creation_log
CREATE POLICY "Admins can view account creation logs"
  ON account_creation_log
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

-- Function to log account creation
CREATE OR REPLACE FUNCTION log_account_creation()
RETURNS trigger AS $$
BEGIN
  INSERT INTO account_creation_log (
    user_id,
    created_by,
    ip_address
  ) VALUES (
    NEW.id,
    auth.uid(),
    inet_client_addr()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for logging account creation
CREATE TRIGGER log_new_account
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION log_account_creation();

-- Function to require 2FA for admin accounts
CREATE OR REPLACE FUNCTION require_admin_2fa()
RETURNS trigger AS $$
BEGIN
  IF NEW.role = 'admin' THEN
    INSERT INTO two_factor_auth (user_id, enabled)
    VALUES (NEW.id, true)
    ON CONFLICT (user_id) DO UPDATE
    SET enabled = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to enable 2FA for admin accounts
CREATE TRIGGER enable_admin_2fa
  AFTER INSERT OR UPDATE OF role ON users
  FOR EACH ROW
  WHEN (NEW.role = 'admin')
  EXECUTE FUNCTION require_admin_2fa();

-- Create default admin account
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'ckabakwu@hygienemaids.com'
  ) THEN
    INSERT INTO users (
      email,
      full_name,
      role,
      created_at
    ) VALUES (
      'ckabakwu@hygienemaids.com',
      'Admin User',
      'admin',
      now()
    );
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_two_factor_auth_user ON two_factor_auth(user_id);
CREATE INDEX IF NOT EXISTS idx_account_creation_log_user ON account_creation_log(user_id);
CREATE INDEX IF NOT EXISTS idx_account_creation_log_created_by ON account_creation_log(created_by);

-- Update function to validate password requirements
CREATE OR REPLACE FUNCTION validate_password()
RETURNS trigger AS $$
BEGIN
  IF NEW.encrypted_password IS NOT NULL AND (
    length(NEW.encrypted_password) < 8 OR
    NEW.encrypted_password !~ '[0-9]' OR
    NEW.encrypted_password !~ '[a-z]' OR
    NEW.encrypted_password !~ '[A-Z]' OR
    NEW.encrypted_password !~ '[!@#$%^&*]'
  ) THEN
    RAISE EXCEPTION 'Password must be at least 8 characters and contain at least one number, uppercase letter, lowercase letter, and special character';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;