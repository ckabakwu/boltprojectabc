/*
  # Service Areas and Health Monitoring

  1. New Tables
    - service_locations: For defining service areas
    - location_pricing: For area-specific pricing
    - api_health_checks: For monitoring system health

  2. Security
    - Enable RLS on all tables
    - Add admin-only policies
    - Secure location data

  3. Changes
    - Add location-based job management
    - Add service area definitions
    - Add health monitoring
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin users can manage service locations" ON service_locations;
DROP POLICY IF EXISTS "Admin users can manage location pricing" ON location_pricing;
DROP POLICY IF EXISTS "Public can view active service areas" ON service_locations;
DROP POLICY IF EXISTS "Enable insert access for public" ON api_health_checks;
DROP POLICY IF EXISTS "Enable select access for admin users" ON api_health_checks;

-- Create service locations table
CREATE TABLE IF NOT EXISTS service_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  boundary geometry,
  radius numeric,
  center_point point,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT service_locations_type_check CHECK (
    type = ANY (ARRAY['zipcode', 'city', 'radius', 'custom'])
  )
);

-- Create location pricing table
CREATE TABLE IF NOT EXISTS location_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid REFERENCES service_locations(id) ON DELETE CASCADE,
  service_type text NOT NULL,
  base_price numeric NOT NULL,
  minimum_price numeric NOT NULL,
  peak_multiplier numeric DEFAULT 1.0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create API health checks table
CREATE TABLE IF NOT EXISTS api_health_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  endpoint text NOT NULL,
  status text NOT NULL,
  response_time integer NOT NULL,
  error text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create spatial indexes
CREATE INDEX IF NOT EXISTS idx_service_locations_boundary ON service_locations USING gist (boundary);
CREATE INDEX IF NOT EXISTS idx_service_locations_type ON service_locations(type);
CREATE INDEX IF NOT EXISTS idx_service_locations_active ON service_locations(active);

-- Create regular indexes
CREATE INDEX IF NOT EXISTS idx_location_pricing_location ON location_pricing(location_id);
CREATE INDEX IF NOT EXISTS idx_api_health_checks_endpoint ON api_health_checks(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_health_checks_status ON api_health_checks(status);
CREATE INDEX IF NOT EXISTS idx_api_health_checks_timestamp ON api_health_checks(timestamp);

-- Enable RLS
ALTER TABLE service_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_health_checks ENABLE ROW LEVEL SECURITY;

-- Create policies with unique names
CREATE POLICY "service_locations_admin_all" 
  ON service_locations
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "location_pricing_admin_all"
  ON location_pricing
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "service_locations_public_view"
  ON service_locations
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "api_health_checks_public_insert"
  ON api_health_checks
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "api_health_checks_admin_select"
  ON api_health_checks
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_service_locations_updated_at ON service_locations;
CREATE TRIGGER update_service_locations_updated_at
  BEFORE UPDATE ON service_locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_location_pricing_updated_at ON location_pricing;
CREATE TRIGGER update_location_pricing_updated_at
  BEFORE UPDATE ON location_pricing
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();