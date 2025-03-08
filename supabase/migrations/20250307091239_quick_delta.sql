/*
  # Admin Management Tables Migration

  1. New Tables
    - `admin_settings` for system configuration
    - `admin_audit_log` for tracking admin actions
    - `admin_api_keys` for API access management
    - `admin_reports` for report configuration

  2. Security
    - Enable RLS on all tables
    - Add admin-only access policies
    - Add audit logging triggers

  3. Changes
    - Add admin management tables
    - Add necessary indexes
    - Add security policies
*/

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}',
  description text,
  category text NOT NULL,
  is_encrypted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON admin_settings(key);
CREATE INDEX IF NOT EXISTS idx_admin_settings_category ON admin_settings(category);

-- Create admin_audit_log table
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES users(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  changes jsonb,
  metadata jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action ON admin_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON admin_audit_log(created_at);

-- Create admin_api_keys table
CREATE TABLE IF NOT EXISTS admin_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  key_hash text NOT NULL UNIQUE,
  scopes text[] DEFAULT '{}',
  last_used_at timestamptz,
  expires_at timestamptz,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_api_keys_key_hash ON admin_api_keys(key_hash);

-- Create admin_reports table
CREATE TABLE IF NOT EXISTS admin_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  type text NOT NULL,
  config jsonb NOT NULL DEFAULT '{}',
  schedule text,
  last_run_at timestamptz,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_reports_type ON admin_reports(type);
CREATE INDEX IF NOT EXISTS idx_admin_reports_created_by ON admin_reports(created_by);

-- Enable RLS
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY admin_settings_policy ON admin_settings
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY admin_audit_log_policy ON admin_audit_log
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY admin_api_keys_policy ON admin_api_keys
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY admin_reports_policy ON admin_reports
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER admin_settings_updated_at
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER admin_api_keys_updated_at
  BEFORE UPDATE ON admin_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER admin_reports_updated_at
  BEFORE UPDATE ON admin_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create audit log function
CREATE OR REPLACE FUNCTION log_admin_action()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_audit_log (
    admin_id,
    action,
    entity_type,
    entity_id,
    changes
  ) VALUES (
    auth.uid(),
    TG_ARGV[0],
    TG_TABLE_NAME,
    NEW.id,
    jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;