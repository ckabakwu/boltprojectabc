/*
  # Auth System Schema Update

  1. New Tables
    - `password_resets`: Manages password reset tokens and their status
    - `security_questions`: Stores user security questions and answers
    - `password_reset_audit`: Audit trail for password reset attempts
    - `auth_sessions`: Tracks user login sessions
    - `auth_attempts`: Tracks login attempts for rate limiting
    - `auth_audit_log`: Audit trail for authentication events
    - `two_factor_auth`: Manages 2FA settings and backup codes

  2. Security
    - Enable RLS on all tables
    - Add policies for secure access
    - Secure indexes for performance
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view their own password resets" ON password_resets;
    DROP POLICY IF EXISTS "Users can manage their own security questions" ON security_questions;
    DROP POLICY IF EXISTS "Users can view their own sessions" ON auth_sessions;
    DROP POLICY IF EXISTS "Users can delete their own sessions" ON auth_sessions;
    DROP POLICY IF EXISTS "Users can manage their own 2FA settings" ON two_factor_auth;
    DROP POLICY IF EXISTS "Admins can view auth audit logs" ON auth_audit_log;
EXCEPTION
    WHEN undefined_table THEN
        NULL;
END $$;

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

-- Auth Sessions Table
CREATE TABLE IF NOT EXISTS auth_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  token text NOT NULL,
  ip_address inet,
  user_agent text,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_used_at timestamptz DEFAULT now()
);

-- Auth Attempts Table
CREATE TABLE IF NOT EXISTS auth_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  ip_address inet NOT NULL,
  user_agent text,
  attempted_at timestamptz DEFAULT now(),
  success boolean NOT NULL,
  error_message text
);

-- Auth Audit Log Table
CREATE TABLE IF NOT EXISTS auth_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  event_type text NOT NULL,
  ip_address inet,
  user_agent text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Two Factor Auth Table
CREATE TABLE IF NOT EXISTS two_factor_auth (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  enabled boolean DEFAULT false,
  secret text,
  backup_codes text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE password_resets ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE two_factor_auth ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Users can view their own sessions"
  ON auth_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own sessions"
  ON auth_sessions
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own 2FA settings"
  ON two_factor_auth
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view auth audit logs"
  ON auth_audit_log
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
DROP TRIGGER IF EXISTS set_password_reset_expiry_trigger ON password_resets;
CREATE TRIGGER set_password_reset_expiry_trigger
  BEFORE INSERT ON password_resets
  FOR EACH ROW
  EXECUTE FUNCTION set_password_reset_expiry();

DROP TRIGGER IF EXISTS update_security_questions_updated_at ON security_questions;
CREATE TRIGGER update_security_questions_updated_at
  BEFORE UPDATE ON security_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_audit_user_id ON password_reset_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_audit_email ON password_reset_audit(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_audit_status ON password_reset_audit(status);
CREATE INDEX IF NOT EXISTS idx_security_questions_user_id ON security_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_token ON auth_sessions(token);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_attempts_email ON auth_attempts(email);
CREATE INDEX IF NOT EXISTS idx_auth_attempts_ip ON auth_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_auth_audit_user ON auth_audit_log(user_id);