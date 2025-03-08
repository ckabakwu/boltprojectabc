/*
  # Password Reset System Enhancement

  1. New Tables
    - `password_resets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `token` (text, unique)
      - `expires_at` (timestamptz)
      - `used` (boolean)
      - `used_at` (timestamptz)
      - `created_at` (timestamptz)
    
    - `password_reset_audit`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `email` (text)
      - `ip_address` (inet)
      - `user_agent` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `expires_at` (timestamptz)
      - `completed_at` (timestamptz)
      - `metadata` (jsonb)

  2. Security
    - Enable RLS on all tables
    - Add policies for secure access
    - Add audit triggers

  3. Changes
    - Add password reset functionality
    - Add audit logging
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS password_resets CASCADE;
DROP TABLE IF EXISTS password_reset_audit CASCADE;

-- Create password_resets table
CREATE TABLE password_resets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create password_reset_audit table
CREATE TABLE password_reset_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  email text NOT NULL,
  ip_address inet,
  user_agent text,
  status text NOT NULL CHECK (status IN ('requested', 'completed', 'expired', 'failed')),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  completed_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE password_resets ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_audit ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS password_resets_user_id_idx ON password_resets(user_id);
CREATE INDEX IF NOT EXISTS password_resets_token_idx ON password_resets(token);
CREATE INDEX IF NOT EXISTS password_reset_audit_email_idx ON password_reset_audit(email);
CREATE INDEX IF NOT EXISTS password_reset_audit_status_idx ON password_reset_audit(status);
CREATE INDEX IF NOT EXISTS password_reset_audit_user_id_idx ON password_reset_audit(user_id);

-- Create RLS policies
CREATE POLICY "Users can view their own password resets" 
  ON password_resets
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all password resets"
  ON password_resets
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "Users can view their own password reset audit"
  ON password_reset_audit
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view password reset audit"
  ON password_reset_audit
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

-- Create function to set password reset expiry
CREATE OR REPLACE FUNCTION set_password_reset_expiry()
RETURNS TRIGGER AS $$
BEGIN
  NEW.expires_at := NOW() + INTERVAL '24 hours';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for setting expiry
CREATE TRIGGER set_password_reset_expiry_trigger
  BEFORE INSERT ON password_resets
  FOR EACH ROW
  EXECUTE FUNCTION set_password_reset_expiry();

CREATE TRIGGER set_password_reset_audit_expiry_trigger
  BEFORE INSERT ON password_reset_audit
  FOR EACH ROW
  EXECUTE FUNCTION set_password_reset_expiry();

-- Create function to validate password reset token
CREATE OR REPLACE FUNCTION validate_reset_token(token_input text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM password_resets
    WHERE token = token_input
    AND used = false
    AND expires_at > NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to complete password reset
CREATE OR REPLACE FUNCTION complete_password_reset(token_input text)
RETURNS boolean AS $$
BEGIN
  UPDATE password_resets
  SET used = true,
      used_at = NOW()
  WHERE token = token_input
  AND used = false
  AND expires_at > NOW();
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;