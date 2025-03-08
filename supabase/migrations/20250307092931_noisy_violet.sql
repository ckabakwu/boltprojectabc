/*
  # Email and Communication System

  1. New Tables
    - `communication_templates` - Stores email/SMS templates
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text)
      - `subject` (text)
      - `content` (text)
      - `variables` (text[])
      - `active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `email_logs` - Tracks all sent emails
      - `id` (uuid, primary key)
      - `email_to` (text)
      - `subject` (text)
      - `template_name` (text)
      - `status` (text)
      - `error` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Admins can manage templates and view all logs
    - Users can only view their own email logs

  3. Functions
    - Add function to check for inactive users
    - Add function to update updated_at timestamp
*/

-- Drop existing tables and policies if they exist
DROP TABLE IF EXISTS communication_templates CASCADE;
DROP TABLE IF EXISTS email_logs CASCADE;

-- Create communication templates table
CREATE TABLE communication_templates (
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

-- Create email logs table
CREATE TABLE email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_to text NOT NULL,
  subject text NOT NULL,
  template_name text NOT NULL,
  status text NOT NULL,
  error text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indices for better performance
CREATE INDEX idx_email_logs_created_at ON email_logs(created_at);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_template ON email_logs(template_name);
CREATE INDEX idx_email_logs_email_to ON email_logs(email_to);

-- Enable RLS
ALTER TABLE communication_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admins can manage communication templates"
  ON communication_templates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all email logs"
  ON email_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can view their own email logs"
  ON email_logs
  FOR SELECT
  TO authenticated
  USING (
    email_to IN (
      SELECT email 
      FROM users 
      WHERE users.id = auth.uid()
    )
  );

-- Function to check for inactive users and send reminders
CREATE OR REPLACE FUNCTION check_inactive_users() 
RETURNS void AS $$
DECLARE
  inactive_user RECORD;
  template_content RECORD;
  discount_code TEXT;
BEGIN
  -- Get inactive users (no bookings in last 30 days)
  FOR inactive_user IN 
    SELECT DISTINCT u.id, u.email, u.full_name, 
           MAX(b.created_at) as last_booking
    FROM users u
    LEFT JOIN bookings b ON b.customer_id = u.id
    WHERE u.role = 'customer'
    GROUP BY u.id, u.email, u.full_name
    HAVING MAX(b.created_at) < NOW() - INTERVAL '30 days'
    OR MAX(b.created_at) IS NULL
  LOOP
    -- Generate unique discount code
    discount_code := 'WELCOME' || FLOOR(RANDOM() * 10000)::TEXT;
    
    -- Get email template
    SELECT * FROM communication_templates 
    WHERE name = 'inactive_user_reminder' 
    AND active = true 
    LIMIT 1 
    INTO template_content;

    IF FOUND THEN
      -- Insert into email logs
      INSERT INTO email_logs (
        email_to,
        subject,
        template_name,
        status,
        metadata
      ) VALUES (
        inactive_user.email,
        REPLACE(template_content.subject, '{{name}}', inactive_user.full_name),
        'inactive_user_reminder',
        'pending',
        jsonb_build_object(
          'user_id', inactive_user.id,
          'discount_code', discount_code,
          'last_booking', inactive_user.last_booking
        )
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_communication_templates_updated_at
  BEFORE UPDATE ON communication_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial email template
INSERT INTO communication_templates (
  name,
  type,
  subject,
  content,
  variables
) VALUES (
  'inactive_user_reminder',
  'email',
  'We miss you, {{name}}! Special offer inside 🏠✨',
  '<!DOCTYPE html>
  <html>
  <body>
    <h2>Hi {{name}},</h2>
    <p>We noticed it''s been a while since your last cleaning with HomeMaidy. We hope everything is well!</p>
    <p>To welcome you back, we''re offering a special discount on your next cleaning:</p>
    <div style="background-color: #f3f4f6; padding: 20px; margin: 20px 0; text-align: center;">
      <h3 style="color: #1d4ed8; margin: 0;">Get 20% off your next cleaning</h3>
      <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">Code: {{discount_code}}</p>
      <p style="color: #4b5563; margin: 0;">Valid for 7 days</p>
    </div>
    <p>Book now to secure your preferred time slot:</p>
    <a href="{{booking_url}}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Book Now</a>
    <p>If you have any questions or need assistance, our support team is here to help!</p>
    <p>Best regards,<br>The HomeMaidy Team</p>
  </body>
  </html>',
  ARRAY['name', 'discount_code', 'booking_url']
);