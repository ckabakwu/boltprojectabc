/*
  # Location Management System

  1. New Tables
    - `service_locations`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text) - zipcode/city/radius/custom
      - `boundary` (geometry)
      - `radius` (numeric) - for radius-based locations
      - `center_point` (point) - for radius-based locations
      - `active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `location_pricing`
      - `id` (uuid, primary key)
      - `location_id` (uuid, foreign key)
      - `service_type` (text)
      - `base_price` (numeric)
      - `minimum_price` (numeric)
      - `peak_multiplier` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access

  3. Functions
    - Location validation function
    - Geocoding function
    - Location search function
*/

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create service_locations table
CREATE TABLE IF NOT EXISTS service_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('zipcode', 'city', 'radius', 'custom')),
  boundary geometry,
  radius numeric,
  center_point point,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create location_pricing table
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

-- Enable Row Level Security
ALTER TABLE service_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_pricing ENABLE ROW LEVEL SECURITY;

-- Create policies for service_locations
CREATE POLICY "Admin users can manage service locations"
  ON service_locations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create policies for location_pricing
CREATE POLICY "Admin users can manage location pricing"
  ON location_pricing
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create function to validate location within service area
CREATE OR REPLACE FUNCTION is_location_serviceable(check_point geometry)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM service_locations
    WHERE active = true
    AND (
      -- For radius-based locations
      (type = 'radius' AND 
       ST_DWithin(
         ST_SetSRID(ST_MakePoint(ST_X(center_point::point), ST_Y(center_point::point)), 4326),
         check_point,
         radius * 1609.34  -- Convert miles to meters
       ))
      OR
      -- For other boundary types
      (type != 'radius' AND ST_Contains(boundary, check_point))
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to search locations
CREATE OR REPLACE FUNCTION search_locations(search_term text)
RETURNS TABLE (
  id uuid,
  name text,
  type text,
  active boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    l.name,
    l.type,
    l.active
  FROM service_locations l
  WHERE 
    l.name ILIKE '%' || search_term || '%'
    OR l.type ILIKE '%' || search_term || '%';
END;
$$ LANGUAGE plpgsql;

-- Create indexes
CREATE INDEX idx_service_locations_type ON service_locations(type);
CREATE INDEX idx_service_locations_active ON service_locations(active);
CREATE INDEX idx_service_locations_boundary ON service_locations USING GIST(boundary);
CREATE INDEX idx_location_pricing_location ON location_pricing(location_id);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_service_locations_updated_at
  BEFORE UPDATE ON service_locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_location_pricing_updated_at
  BEFORE UPDATE ON location_pricing
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();