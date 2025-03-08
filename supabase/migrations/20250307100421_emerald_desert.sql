/*
  # Campaign and Communication System

  1. New Tables
    - campaigns: For managing email/SMS campaigns
    - campaign_recipients: For tracking campaign recipients
    - campaign_analytics: For tracking campaign performance
    - message_templates: For storing reusable message templates
    - communication_preferences: For user communication preferences

  2. Security
    - Enable RLS on all tables
    - Add admin-only management policies
    - Add user-specific view policies

  3. Changes
    - Add campaign tracking
    - Add analytics tracking
    - Add preference management
*/

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  subject text,
  content text NOT NULL,
  schedule_type text NOT NULL,
  schedule_time timestamptz,
  status text NOT NULL DEFAULT 'draft',
  target_audience jsonb NOT NULL DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT campaigns_type_check CHECK (
    type = ANY (ARRAY['email', 'sms'])
  ),
  CONSTRAINT campaigns_schedule_type_check CHECK (
    schedule_type = ANY (ARRAY['immediate', 'scheduled', 'recurring'])
  ),
  CONSTRAINT campaigns_status_check CHECK (
    status = ANY (ARRAY['draft', 'scheduled', 'sending', 'completed', 'failed', 'cancelled'])
  )
);

-- Create campaign recipients table
CREATE TABLE IF NOT EXISTS campaign_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  status text NOT NULL DEFAULT 'pending',
  sent_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  error text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT campaign_recipients_status_check CHECK (
    status = ANY (ARRAY['pending', 'sent', 'failed', 'bounced', 'opened', 'clicked'])
  )
);

-- Create campaign analytics table
CREATE TABLE IF NOT EXISTS campaign_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  total_recipients integer DEFAULT 0,
  sent_count integer DEFAULT 0,
  open_count integer DEFAULT 0,
  click_count integer DEFAULT 0,
  bounce_count integer DEFAULT 0,
  conversion_count integer DEFAULT 0,
  last_updated timestamptz DEFAULT now()
);

-- Create message templates table
CREATE TABLE IF NOT EXISTS message_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  subject text,
  content text NOT NULL,
  variables jsonb DEFAULT '[]',
  category text NOT NULL,
  active boolean DEFAULT true,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT message_templates_type_check CHECK (
    type = ANY (ARRAY['email', 'sms'])
  )
);

-- Create communication preferences table
CREATE TABLE IF NOT EXISTS communication_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  email_marketing boolean DEFAULT true,
  email_notifications boolean DEFAULT true,
  sms_marketing boolean DEFAULT true,
  sms_notifications boolean DEFAULT true,
  unsubscribed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "admin_manage_campaigns_policy"
  ON campaigns
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "admin_manage_campaign_recipients_policy"
  ON campaign_recipients
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "admin_manage_campaign_analytics_policy"
  ON campaign_analytics
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "admin_manage_message_templates_policy"
  ON message_templates
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "users_manage_own_preferences_policy"
  ON communication_preferences
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON campaigns(type);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_schedule ON campaigns(schedule_time);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_campaign ON campaign_recipients(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_user ON campaign_recipients(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_status ON campaign_recipients(status);
CREATE INDEX IF NOT EXISTS idx_message_templates_type ON message_templates(type);
CREATE INDEX IF NOT EXISTS idx_message_templates_category ON message_templates(category);
CREATE INDEX IF NOT EXISTS idx_communication_preferences_user ON communication_preferences(user_id);

-- Create function to update campaign analytics
CREATE OR REPLACE FUNCTION update_campaign_analytics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO campaign_analytics (
    campaign_id,
    total_recipients,
    sent_count,
    open_count,
    click_count,
    bounce_count
  )
  SELECT
    NEW.id,
    0, 0, 0, 0, 0
  ON CONFLICT (campaign_id) DO UPDATE
  SET last_updated = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for campaign analytics
CREATE TRIGGER update_campaign_analytics_trigger
  AFTER INSERT ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_campaign_analytics();

-- Create function to track campaign engagement
CREATE OR REPLACE FUNCTION track_campaign_engagement()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    UPDATE campaign_analytics
    SET
      sent_count = CASE 
        WHEN NEW.status = 'sent' THEN sent_count + 1 
        ELSE sent_count 
      END,
      open_count = CASE 
        WHEN NEW.status = 'opened' THEN open_count + 1 
        ELSE open_count 
      END,
      click_count = CASE 
        WHEN NEW.status = 'clicked' THEN click_count + 1 
        ELSE click_count 
      END,
      bounce_count = CASE 
        WHEN NEW.status = 'bounced' THEN bounce_count + 1 
        ELSE bounce_count 
      END,
      last_updated = now()
    WHERE campaign_id = NEW.campaign_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for campaign engagement tracking
CREATE TRIGGER track_campaign_engagement_trigger
  AFTER UPDATE ON campaign_recipients
  FOR EACH ROW
  EXECUTE FUNCTION track_campaign_engagement();