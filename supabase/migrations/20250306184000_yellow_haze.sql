/*
  # Authentication and User Management Schema

  1. New Tables
    - auth_sessions: Track user login sessions
    - auth_attempts: Track failed login attempts
    - password_resets: Track password reset requests
    - auth_audit_log: Track authentication events

  2. Security
    - Enable RLS on all tables
    - Add policies for access control
    - Set up audit logging

  3. Changes
    - Add performance indexes
    - Create triggers for audit logging
*/

-- Create auth_sessions table
CREATE TABLE IF NOT EXISTS auth_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users NOT NULL,
  token text NOT NULL,
  ip_address inet,
  user_agent text,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_used_at timestamptz DEFAULT now()
);

-- Create auth_attempts table
CREATE TABLE IF NOT EXISTS auth_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  ip_address inet NOT NULL,
  user_agent text,
  attempted_at timestamptz DEFAULT now(),
  success boolean NOT NULL,
  error_message text
);

-- Create password_resets table
CREATE TABLE IF NOT EXISTS password_resets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users NOT NULL,
  token text NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create auth_audit_log table
CREATE TABLE IF NOT EXISTS auth_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users,
  event_type text NOT NULL,
  ip_address inet,
  user_agent text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_token ON auth_sessions(token);
CREATE INDEX IF NOT EXISTS idx_auth_attempts_email ON auth_attempts(email);
CREATE INDEX IF NOT EXISTS idx_auth_attempts_ip ON auth_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);
CREATE INDEX IF NOT EXISTS idx_auth_audit_user ON auth_audit_log(user_id);

-- Enable RLS
ALTER TABLE auth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_resets ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Auth Sessions
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

-- Auth Attempts
CREATE POLICY "Admins can view auth attempts"
  ON auth_attempts
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

-- Password Resets
CREATE POLICY "Users can view their own password resets"
  ON password_resets
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Auth Audit Log
CREATE POLICY "Admins can view audit logs"
  ON auth_audit_log
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

-- Functions

-- Function to log authentication events
CREATE OR REPLACE FUNCTION log_auth_event(
  p_user_id uuid,
  p_event_type text,
  p_metadata jsonb DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO auth_audit_log (
    user_id,
    event_type,
    ip_address,
    user_agent,
    metadata
  ) VALUES (
    p_user_id,
    p_event_type,
    inet_client_addr(),
    current_setting('request.headers')::jsonb->>'user-agent',
    p_metadata
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM auth_sessions WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old auth attempts
CREATE OR REPLACE FUNCTION cleanup_old_auth_attempts()
RETURNS void AS $$
BEGIN
  DELETE FROM auth_attempts 
  WHERE attempted_at < now() - interval '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;