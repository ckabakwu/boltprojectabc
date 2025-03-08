/*
  # Fix API Health Checks RLS Policies

  1. Changes
    - Drop existing RLS policies
    - Create new, more permissive policies for health check logging
    - Allow unauthenticated inserts for system health monitoring
    - Maintain admin-only access for viewing records

  2. Security
    - Enable RLS
    - Add policies for insert and select operations
    - Ensure system can log health checks without auth
    - Restrict viewing to admin users only
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON api_health_checks;
DROP POLICY IF EXISTS "Enable read access for admin users" ON api_health_checks;
DROP POLICY IF EXISTS "Enable update access for admin users" ON api_health_checks;
DROP POLICY IF EXISTS "Enable delete access for admin users" ON api_health_checks;

-- Enable RLS
ALTER TABLE api_health_checks ENABLE ROW LEVEL SECURITY;

-- Allow inserts from any source (including unauthenticated)
-- This is necessary for system health monitoring
CREATE POLICY "Enable insert access for all"
ON api_health_checks
FOR INSERT
TO public
WITH CHECK (true);

-- Only admin users can view health check records
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

-- Only admin users can update health check records
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

-- Only admin users can delete health check records
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