/*
  # API Health Checks Table Setup

  1. New Table
    - Create api_health_checks table if it doesn't exist
    - Add all required columns with proper types
    - Add appropriate indexes for performance

  2. Security
    - Enable RLS
    - Add policies for inserting and viewing health checks
    - Ensure proper access control based on user roles

  3. Changes
    - Adds comprehensive health check logging capabilities
    - Ensures proper security and access control
*/

-- Create api_health_checks table if it doesn't exist
CREATE TABLE IF NOT EXISTS api_health_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint text NOT NULL,
  status text NOT NULL,
  response_time integer NOT NULL,
  error text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_api_health_checks_endpoint ON api_health_checks(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_health_checks_status ON api_health_checks(status);
CREATE INDEX IF NOT EXISTS idx_api_health_checks_created_at ON api_health_checks(created_at);

-- Enable RLS
ALTER TABLE api_health_checks ENABLE ROW LEVEL SECURITY;

-- Policy for inserting health checks
-- Any authenticated user can insert health checks
CREATE POLICY "Enable insert access for authenticated users"
ON api_health_checks
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy for viewing health checks
-- Only admin users can view health checks
CREATE POLICY "Enable read access for admin users"
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

-- Policy for updating health checks
-- Only admin users can update health checks
CREATE POLICY "Enable update access for admin users"
ON api_health_checks
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Policy for deleting health checks
-- Only admin users can delete health checks
CREATE POLICY "Enable delete access for admin users"
ON api_health_checks
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);