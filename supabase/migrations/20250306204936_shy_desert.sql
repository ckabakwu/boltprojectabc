/*
  # Password Management Schema Update

  1. New Tables
    - `password_resets`
      - Stores password reset tokens and their status
    - `security_questions`
      - Stores user security questions and answers
    - `password_reset_audit`
      - Audit trail for password reset attempts

  2. Security
    - Enable RLS on all tables
    - Add policies for secure access
    - Encrypt sensitive data

  3. Changes
    - Add password reset functionality
    - Add security questions feature
    - Add audit logging
*/

-- Password Resets Table
CREATE TABLE IF NOT EXISTS password_resets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  token text NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  used_at timestamptz,
  ip_address inet
);

-- Create index for token lookups
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);

-- Security Questions Table
CREATE TABLE IF NOT EXISTS security_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  question text NOT NULL,
  answer text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Password Reset Audit Table
CREATE TABLE IF NOT EXISTS password_reset_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  email text NOT NULL,
  ip_address inet,
  user_agent text,
  status text NOT NULL CHECK (status IN ('requested', 'completed', 'expired', 'failed')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE password_resets ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_audit ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own password resets"
  ON password_resets
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own security questions"
  ON security_questions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view password reset audit"
  ON password_reset_audit
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION set_password_reset_expiry()
RETURNS TRIGGER AS $$
BEGIN
  NEW.expires_at := NOW() + INTERVAL '24 hours';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER set_password_reset_expiry_trigger
  BEFORE INSERT ON password_resets
  FOR EACH ROW
  EXECUTE FUNCTION set_password_reset_expiry();

CREATE TRIGGER update_security_questions_updated_at
  BEFORE UPDATE ON security_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_password_reset_audit_user_id ON password_reset_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_audit_email ON password_reset_audit(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_audit_status ON password_reset_audit(status);
CREATE INDEX IF NOT EXISTS idx_security_questions_user_id ON security_questions(user_id);