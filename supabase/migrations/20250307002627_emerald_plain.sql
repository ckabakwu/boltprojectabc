/*
  # Create API Health Checks Table

  1. New Tables
    - `api_health_checks`
      - `id` (uuid, primary key)
      - `timestamp` (timestamptz)
      - `endpoint` (text)
      - `status` (text)
      - `response_time` (integer)
      - `error` (text, nullable)
      - `metadata` (jsonb, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `api_health_checks` table
    - Add policy for admin access
*/

-- Create API health checks table
CREATE TABLE IF NOT EXISTS api_health_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  endpoint text NOT NULL,
  status text NOT NULL,
  response_time integer NOT NULL,
  error text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE api_health_checks ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Admin users can manage health checks"
  ON api_health_checks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create index on timestamp for better query performance
CREATE INDEX idx_api_health_checks_timestamp ON api_health_checks(timestamp);