/*
  # Add Email Log Table

  1. New Tables
    - `email_log`
      - `id` (uuid, primary key)
      - `to` (text)
      - `subject` (text)
      - `template_name` (text)
      - `status` (text)
      - `error` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `email_log` table
    - Add policy for admins to view all logs
    - Add policy for users to view their own logs
*/

-- Create email log table
CREATE TABLE IF NOT EXISTS email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "to" text NOT NULL,
  subject text NOT NULL,
  template_name text NOT NULL,
  status text NOT NULL CHECK (status IN ('sent', 'failed')),
  error text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;

-- Admin can view all logs
CREATE POLICY "Admins can view all email logs"
  ON email_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Users can view their own logs
CREATE POLICY "Users can view their own email logs"
  ON email_log
  FOR SELECT
  TO authenticated
  USING (
    "to" IN (
      SELECT email FROM users
      WHERE users.id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_email_log_to ON email_log("to");
CREATE INDEX idx_email_log_status ON email_log(status);
CREATE INDEX idx_email_log_template ON email_log(template_name);
CREATE INDEX idx_email_log_created_at ON email_log(created_at);