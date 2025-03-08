/*
  # Add Password Reset Audit Table

  1. New Tables
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
    - Enable RLS on `password_reset_audit` table
    - Add policy for admins to view all records
    - Add policy for users to view their own records
*/

-- Create password reset audit table
CREATE TABLE IF NOT EXISTS password_reset_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
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
ALTER TABLE password_reset_audit ENABLE ROW LEVEL SECURITY;

-- Admin can view all records
CREATE POLICY "Admins can view all password reset records"
  ON password_reset_audit
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Users can view their own records
CREATE POLICY "Users can view their own password reset records"
  ON password_reset_audit
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
  );

-- Create index for faster lookups
CREATE INDEX idx_password_reset_audit_user_id ON password_reset_audit(user_id);
CREATE INDEX idx_password_reset_audit_email ON password_reset_audit(email);
CREATE INDEX idx_password_reset_audit_status ON password_reset_audit(status);

-- Create function to automatically set expiry time
CREATE OR REPLACE FUNCTION set_password_reset_expiry()
RETURNS TRIGGER AS $$
BEGIN
  NEW.expires_at := NEW.created_at + interval '1 hour';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set expiry time
CREATE TRIGGER set_password_reset_expiry_trigger
  BEFORE INSERT ON password_reset_audit
  FOR EACH ROW
  EXECUTE FUNCTION set_password_reset_expiry();

-- Create function to log password reset attempts
CREATE OR REPLACE FUNCTION log_password_reset_attempt(
  p_email text,
  p_ip_address inet,
  p_user_agent text,
  p_status text DEFAULT 'requested'
)
RETURNS uuid AS $$
DECLARE
  v_user_id uuid;
  v_audit_id uuid;
BEGIN
  -- Get user ID if email exists
  SELECT id INTO v_user_id FROM users WHERE email = p_email;
  
  -- Insert audit record
  INSERT INTO password_reset_audit (
    user_id,
    email,
    ip_address,
    user_agent,
    status
  ) VALUES (
    v_user_id,
    p_email,
    p_ip_address,
    p_user_agent,
    p_status
  ) RETURNING id INTO v_audit_id;
  
  RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;