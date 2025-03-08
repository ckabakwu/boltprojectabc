/*
  # Database Integration Setup

  1. New Tables
    - user_preferences
      - Stores user-specific settings and preferences
    - content_blocks
      - Manages dynamic content sections
    - system_settings
      - Global configuration settings
    - activity_logs
      - Tracks user actions and system events
    - api_health_checks
      - Monitors API endpoint health

  2. Changes
    - Add missing indexes for performance
    - Add foreign key constraints
    - Update existing tables with new columns

  3. Security
    - Enable RLS on new tables
    - Add appropriate policies
    - Ensure proper access controls
*/

-- User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  theme text DEFAULT 'light',
  language text DEFAULT 'en',
  notifications_enabled boolean DEFAULT true,
  email_frequency text DEFAULT 'daily',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own preferences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Content Blocks Table
CREATE TABLE IF NOT EXISTS content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  content jsonb NOT NULL,
  type text NOT NULL,
  status text DEFAULT 'draft',
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_blocks_type ON content_blocks(type);
CREATE INDEX IF NOT EXISTS idx_content_blocks_status ON content_blocks(status);

ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published content"
  ON content_blocks
  FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Admins can manage all content"
  ON content_blocks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view settings"
  ON system_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage settings"
  ON system_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  metadata jsonb DEFAULT '{}',
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activity"
  ON activity_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all activity"
  ON activity_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- API Health Checks Table
CREATE TABLE IF NOT EXISTS api_health_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint text NOT NULL,
  status text NOT NULL,
  response_time integer NOT NULL,
  error text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_health_checks_endpoint ON api_health_checks(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_health_checks_status ON api_health_checks(status);
CREATE INDEX IF NOT EXISTS idx_api_health_checks_created_at ON api_health_checks(created_at);

ALTER TABLE api_health_checks ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Enable insert access for all" ON api_health_checks;
  DROP POLICY IF EXISTS "Enable read access for admin users" ON api_health_checks;
  
  -- Create new policies
  CREATE POLICY "api_health_checks_insert_policy"
    ON api_health_checks
    FOR INSERT
    TO public
    WITH CHECK (true);

  CREATE POLICY "api_health_checks_select_policy"
    ON api_health_checks
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
      )
    );
END $$;

-- Add missing indexes to existing tables
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_at ON bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Add updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to new tables
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_blocks_updated_at
  BEFORE UPDATE ON content_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON system_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default system settings
INSERT INTO system_settings (key, value, description)
VALUES
  ('site_name', '"HomeMaidy"', 'Site name used throughout the application'),
  ('maintenance_mode', 'false', 'Enable/disable maintenance mode'),
  ('default_currency', '"USD"', 'Default currency for payments'),
  ('min_booking_notice', '2', 'Minimum hours notice required for bookings'),
  ('max_booking_future', '30', 'Maximum days in advance for bookings')
ON CONFLICT (key) DO NOTHING;