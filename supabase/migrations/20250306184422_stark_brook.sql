/*
  # Auth System Migration

  1. New Tables
    - auth_sessions: Track user sessions
    - auth_attempts: Track login attempts
    - password_resets: Manage password reset tokens
    - auth_audit_log: Audit trail for auth events

  2. Security
    - Enable RLS on all tables
    - Add policies for access control
    - Add audit logging functions
*/

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Auth Sessions
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

-- Auth Attempts
CREATE TABLE IF NOT EXISTS auth_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  ip_address inet NOT NULL,
  user_agent text,
  attempted_at timestamptz DEFAULT now(),
  success boolean NOT NULL,
  error_message text
);

-- Password Resets
CREATE TABLE IF NOT EXISTS password_resets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users NOT NULL,
  token text NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Auth Audit Log
CREATE TABLE IF NOT EXISTS auth_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users,
  event_type text NOT NULL,
  ip_address inet,
  user_agent text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_auth_sessions_token ON auth_sessions(token);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_attempts_email ON auth_attempts(email);
CREATE INDEX IF NOT EXISTS idx_auth_attempts_ip ON auth_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);
CREATE INDEX IF NOT EXISTS idx_auth_audit_user ON auth_audit_log(user_id);

-- Enable RLS
ALTER TABLE auth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_resets ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_audit_log ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own sessions" ON auth_sessions;
DROP POLICY IF EXISTS "Users can delete their own sessions" ON auth_sessions;
DROP POLICY IF EXISTS "Admins can view auth attempts" ON auth_attempts;
DROP POLICY IF EXISTS "Users can view their own password resets" ON password_resets;
DROP POLICY IF EXISTS "Admins can view audit logs" ON auth_audit_log;

-- RLS Policies

-- Auth Sessions
CREATE POLICY "view_own_sessions"
  ON auth_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "delete_own_sessions"
  ON auth_sessions
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Auth Attempts
CREATE POLICY "admin_view_auth_attempts"
  ON auth_attempts
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

-- Password Resets
CREATE POLICY "view_own_password_resets"
  ON password_resets
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Auth Audit Log
CREATE POLICY "admin_view_audit_logs"
  ON auth_audit_log
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

-- Functions

-- Function to check auth attempts
CREATE OR REPLACE FUNCTION check_auth_attempts(
  p_email text,
  p_ip_address inet
) RETURNS boolean AS $$
DECLARE
  attempt_count integer;
  last_attempt timestamptz;
BEGIN
  -- Get attempts in last 15 minutes
  SELECT COUNT(*), MAX(attempted_at)
  INTO attempt_count, last_attempt
  FROM auth_attempts
  WHERE email = p_email
    AND ip_address = p_ip_address
    AND attempted_at > now() - interval '15 minutes'
    AND NOT success;
    
  -- Allow if less than 5 attempts
  RETURN attempt_count < 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log auth events
CREATE OR REPLACE FUNCTION log_auth_event(
  p_user_id uuid,
  p_event_type text,
  p_metadata jsonb DEFAULT NULL
) RETURNS void AS $$
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
    current_setting('request.headers')::json->>'user-agent',
    p_metadata
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions() RETURNS void AS $$
BEGIN
  DELETE FROM auth_sessions WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old auth attempts
CREATE OR REPLACE FUNCTION cleanup_old_auth_attempts() RETURNS void AS $$
BEGIN
  DELETE FROM auth_attempts WHERE attempted_at < now() - interval '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up used password resets
CREATE OR REPLACE FUNCTION cleanup_used_password_resets() RETURNS void AS $$
BEGIN
  DELETE FROM password_resets 
  WHERE used_at IS NOT NULL 
    OR expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE auth_sessions IS 'Tracks user login sessions';
COMMENT ON TABLE auth_attempts IS 'Tracks login attempts for rate limiting';
COMMENT ON TABLE password_resets IS 'Manages password reset tokens';
COMMENT ON TABLE auth_audit_log IS 'Audit trail for authentication events';