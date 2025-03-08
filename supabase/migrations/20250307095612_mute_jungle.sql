/*
  # CRM and AI Recommendation System

  1. New Tables
    - Lead scoring rules
    - Workflow rules
    - Content blocks
    - Communication templates
    - Email logs
    - Loyalty points and rewards

  2. Security
    - Enable RLS on all tables
    - Add admin-only policies
    - Secure sensitive data

  3. Changes
    - Add loyalty points tracking
    - Add communication management
    - Add workflow automation
*/

-- Drop existing policies and constraints to avoid conflicts
DROP POLICY IF EXISTS "Admins can manage lead scoring rules" ON lead_scoring_rules;
DROP POLICY IF EXISTS "Admins can manage workflow rules" ON workflow_rules;
DROP POLICY IF EXISTS "Admins can manage content blocks" ON content_blocks;
DROP POLICY IF EXISTS "Admins can manage communication templates" ON communication_templates;
DROP POLICY IF EXISTS "Admins can view email logs" ON email_log;
DROP POLICY IF EXISTS "Users can view their own loyalty points" ON loyalty_points;
DROP POLICY IF EXISTS "Users can view active rewards" ON loyalty_rewards;
DROP POLICY IF EXISTS "Admins can manage rewards" ON loyalty_rewards;

ALTER TABLE email_log DROP CONSTRAINT IF EXISTS email_log_status_check;
ALTER TABLE loyalty_points DROP CONSTRAINT IF EXISTS loyalty_points_points_check;

-- Create lead scoring rules table
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

-- Create workflow rules table
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

-- Create content blocks table for email templates and campaigns
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

-- Create communication templates table
CREATE TABLE IF NOT EXISTS communication_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  subject text,
  content text NOT NULL,
  variables text[] DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create email log table
CREATE TABLE IF NOT EXISTS email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "to" text NOT NULL,
  subject text NOT NULL,
  template_name text NOT NULL,
  status text NOT NULL,
  error text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create loyalty points table
CREATE TABLE IF NOT EXISTS loyalty_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  points integer NOT NULL,
  transaction_type text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create loyalty rewards table
CREATE TABLE IF NOT EXISTS loyalty_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  points_required integer NOT NULL,
  discount_amount numeric NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add total_points column to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'total_points'
  ) THEN
    ALTER TABLE users ADD COLUMN total_points integer DEFAULT 0;
  END IF;
END $$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_total_points ON loyalty_points;

-- Create function to update user total points
CREATE OR REPLACE FUNCTION update_user_total_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET total_points = (
    SELECT COALESCE(SUM(points), 0)
    FROM loyalty_points
    WHERE user_id = NEW.user_id
  )
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create new trigger for updating total points
CREATE TRIGGER update_total_points
AFTER INSERT OR UPDATE ON loyalty_points
FOR EACH ROW
EXECUTE FUNCTION update_user_total_points();

-- Enable RLS
ALTER TABLE lead_scoring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_rewards ENABLE ROW LEVEL SECURITY;

-- Create policies with unique names
CREATE POLICY "admin_manage_lead_scoring_rules_policy"
  ON lead_scoring_rules
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "admin_manage_workflow_rules_policy"
  ON workflow_rules
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "admin_manage_content_blocks_policy"
  ON content_blocks
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "admin_manage_communication_templates_policy"
  ON communication_templates
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "admin_view_email_logs_policy"
  ON email_log
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "view_own_loyalty_points_policy"
  ON loyalty_points
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "view_active_rewards_policy"
  ON loyalty_rewards
  FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "admin_manage_loyalty_rewards_policy"
  ON loyalty_rewards
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_loyalty_points_user ON loyalty_points(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_type ON loyalty_points(transaction_type);
CREATE INDEX IF NOT EXISTS idx_content_blocks_type ON content_blocks(type);
CREATE INDEX IF NOT EXISTS idx_content_blocks_status ON content_blocks(status);
CREATE INDEX IF NOT EXISTS idx_email_log_template ON email_log(template_name);
CREATE INDEX IF NOT EXISTS idx_email_log_status ON email_log(status);
CREATE INDEX IF NOT EXISTS idx_email_log_created_at ON email_log(created_at);
CREATE INDEX IF NOT EXISTS idx_email_log_to ON email_log("to");

-- Add constraints
ALTER TABLE email_log ADD CONSTRAINT email_log_status_check_new 
  CHECK (status = ANY (ARRAY['sent', 'failed']));

ALTER TABLE loyalty_points ADD CONSTRAINT loyalty_points_points_check_new
  CHECK (points != 0);

-- Create function to add points for booking
CREATE OR REPLACE FUNCTION add_points_for_booking()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO loyalty_points (
      user_id,
      points,
      transaction_type,
      description
    )
    SELECT 
      customers.user_id,
      ROUND(NEW.total_amount * 0.1), -- 10% of booking amount as points
      'booking_completed',
      'Points earned for completed booking'
    FROM customers
    WHERE customers.id = NEW.customer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for booking points
DROP TRIGGER IF EXISTS track_booking_points ON bookings;
CREATE TRIGGER track_booking_points
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION add_points_for_booking();

-- Create function to add referral points
CREATE OR REPLACE FUNCTION add_referral_points()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referred_by IS NOT NULL THEN
    INSERT INTO loyalty_points (
      user_id,
      points,
      transaction_type,
      description
    ) VALUES (
      NEW.referred_by,
      500, -- Points for successful referral
      'referral',
      'Points earned for referring a new user'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for referral points
DROP TRIGGER IF EXISTS track_referral_points ON users;
CREATE TRIGGER track_referral_points
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION add_referral_points();