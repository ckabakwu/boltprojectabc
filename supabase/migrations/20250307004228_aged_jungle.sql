/*
  # API Health Checks RLS Policies

  1. New Policies
    - Enable RLS on api_health_checks table
    - Add policy for inserting health check records
    - Add policy for viewing health check records
  
  2. Security
    - Only authenticated users can insert health checks
    - Only admin users can view health check records
*/

-- Enable RLS
ALTER TABLE api_health_checks ENABLE ROW LEVEL SECURITY;

-- Policy for inserting health checks
CREATE POLICY "Allow authenticated users to insert health checks"
ON api_health_checks
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy for viewing health checks
CREATE POLICY "Only admins can view health checks"
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