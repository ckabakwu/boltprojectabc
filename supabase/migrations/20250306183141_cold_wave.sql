/*
  # Additional Schema Features

  1. New Tables
    - communication_templates: Email/SMS templates
    - lead_scoring_rules: Rules for scoring leads
    - service_area_pricing: Area-specific pricing
    - pro_ratings: Provider ratings and reviews
    - workflow_rules: Automation rules
    - audit_log: System audit trail
    - notification_preferences: User notification settings
    - pro_preferences: Provider preferences

  2. Security
    - Enable RLS on all tables
    - Add policies for access control
    - Set up audit logging

  3. Changes
    - Add performance indexes
    - Create triggers for timestamps and auditing
*/

-- Create updated_at column trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Communication Templates
CREATE TABLE IF NOT EXISTS communication_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  subject text,
  content text NOT NULL,
  variables text[],
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lead Scoring Rules
CREATE TABLE IF NOT EXISTS lead_scoring_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  condition jsonb NOT NULL,
  points integer NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Service Area Pricing
CREATE TABLE IF NOT EXISTS service_area_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_area_id uuid REFERENCES service_areas NOT NULL,
  service_type text NOT NULL,
  base_price numeric(10,2) NOT NULL,
  minimum_price numeric(10,2) NOT NULL,
  peak_multiplier numeric(3,2) DEFAULT 1.0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Pro Ratings and Reviews
CREATE TABLE IF NOT EXISTS pro_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings NOT NULL,
  provider_id uuid REFERENCES service_providers NOT NULL,
  customer_id uuid REFERENCES customers NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review text,
  response text,
  response_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(booking_id, provider_id, customer_id)
);

-- Workflow Rules
CREATE TABLE IF NOT EXISTS workflow_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  trigger_event text NOT NULL,
  condition jsonb,
  actions jsonb[] NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

-- Notification Preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users NOT NULL,
  type text NOT NULL,
  email boolean DEFAULT true,
  sms boolean DEFAULT false,
  push boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, type)
);

-- Pro Preferences
CREATE TABLE IF NOT EXISTS pro_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES service_providers NOT NULL,
  max_daily_jobs integer DEFAULT 4,
  min_job_amount numeric(10,2),
  preferred_job_types text[],
  break_duration interval DEFAULT '30 minutes',
  travel_radius integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(provider_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pro_ratings_provider ON pro_ratings(provider_id);
CREATE INDEX IF NOT EXISTS idx_service_area_pricing_area_id ON service_area_pricing(service_area_id);

-- Enable RLS on new tables
ALTER TABLE communication_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scoring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_area_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Communication Templates
CREATE POLICY "Admins can manage communication templates"
  ON communication_templates
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "All users can view active templates"
  ON communication_templates
  FOR SELECT
  TO authenticated
  USING (active = true);

-- Lead Scoring Rules
CREATE POLICY "Admins can manage lead scoring rules"
  ON lead_scoring_rules
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "All users can view active rules"
  ON lead_scoring_rules
  FOR SELECT
  TO authenticated
  USING (active = true);

-- Service Area Pricing
CREATE POLICY "Admins can manage pricing"
  ON service_area_pricing
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "All users can view pricing"
  ON service_area_pricing
  FOR SELECT
  TO authenticated
  USING (true);

-- Pro Ratings
CREATE POLICY "Users can view pro ratings"
  ON pro_ratings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Customers can create ratings"
  ON pro_ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can respond to their ratings"
  ON pro_ratings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM service_providers
      WHERE service_providers.id = provider_id
      AND service_providers.user_id = auth.uid()
    )
  );

-- Workflow Rules
CREATE POLICY "Admins can manage workflow rules"
  ON workflow_rules
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "All users can view active workflow rules"
  ON workflow_rules
  FOR SELECT
  TO authenticated
  USING (active = true);

-- Audit Log
CREATE POLICY "Admins can view audit logs"
  ON audit_log
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

-- Notification Preferences
CREATE POLICY "Users can manage their notification preferences"
  ON notification_preferences
  TO authenticated
  USING (user_id = auth.uid());

-- Pro Preferences
CREATE POLICY "Providers can manage their preferences"
  ON pro_preferences
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM service_providers
      WHERE service_providers.id = provider_id
      AND service_providers.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all pro preferences"
  ON pro_preferences
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

-- Triggers for audit logging
CREATE OR REPLACE FUNCTION audit_log_changes()
RETURNS TRIGGER AS $$
DECLARE
  record_id uuid;
  old_values jsonb;
  new_values jsonb;
BEGIN
  IF TG_OP = 'DELETE' THEN
    record_id := OLD.id;
    old_values := to_jsonb(OLD);
    new_values := null;
  ELSIF TG_OP = 'UPDATE' THEN
    record_id := NEW.id;
    old_values := to_jsonb(OLD);
    new_values := to_jsonb(NEW);
  ELSE
    record_id := NEW.id;
    old_values := null;
    new_values := to_jsonb(NEW);
  END IF;

  INSERT INTO audit_log (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    ip_address
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    record_id,
    old_values,
    new_values,
    inet_client_addr()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to important tables
CREATE TRIGGER audit_pro_ratings_changes
  AFTER INSERT OR UPDATE OR DELETE ON pro_ratings
  FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER audit_service_area_pricing_changes
  AFTER INSERT OR UPDATE OR DELETE ON service_area_pricing
  FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

-- Update triggers for updated_at
CREATE TRIGGER update_communication_templates_updated_at
  BEFORE UPDATE ON communication_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lead_scoring_rules_updated_at
  BEFORE UPDATE ON lead_scoring_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_area_pricing_updated_at
  BEFORE UPDATE ON service_area_pricing
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pro_ratings_updated_at
  BEFORE UPDATE ON pro_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_rules_updated_at
  BEFORE UPDATE ON workflow_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pro_preferences_updated_at
  BEFORE UPDATE ON pro_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();