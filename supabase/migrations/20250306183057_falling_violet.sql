/*
  # Initial Schema Setup

  1. New Tables
    - users: Core user information
    - service_providers: Provider profiles
    - customers: Customer profiles
    - bookings: Service bookings
    - reviews: Provider reviews
    - service_areas: Provider service areas
    - certifications: Provider certifications

  2. Security
    - Enable RLS on all tables
    - Add policies with existence checks
    - Set up proper constraints and checks

  3. Changes
    - Add performance indexes
    - Enable PostGIS extension
*/

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  full_name text NOT NULL,
  role text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT users_role_check CHECK (role = ANY (ARRAY['admin'::text, 'provider'::text, 'customer'::text]))
);

-- Create service_providers table
CREATE TABLE IF NOT EXISTS service_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users ON DELETE CASCADE,
  rating numeric(3,2) DEFAULT 0.00,
  total_jobs integer DEFAULT 0,
  available boolean DEFAULT true,
  hourly_rate numeric(10,2) NOT NULL,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users ON DELETE CASCADE,
  loyalty_points integer DEFAULT 0,
  total_bookings integer DEFAULT 0,
  preferred_providers uuid[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers ON DELETE CASCADE,
  provider_id uuid REFERENCES service_providers ON DELETE SET NULL,
  service_type text NOT NULL,
  status text NOT NULL,
  scheduled_at timestamptz NOT NULL,
  completed_at timestamptz,
  address text NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT bookings_status_check CHECK (status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'in_progress'::text, 'completed'::text, 'cancelled'::text]))
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings ON DELETE CASCADE,
  customer_id uuid REFERENCES customers ON DELETE CASCADE,
  provider_id uuid REFERENCES service_providers ON DELETE CASCADE,
  rating integer NOT NULL,
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT reviews_rating_check CHECK (rating >= 1 AND rating <= 5)
);

-- Create service_areas table
CREATE TABLE IF NOT EXISTS service_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES service_providers ON DELETE CASCADE,
  zipcode text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES service_providers ON DELETE CASCADE,
  name text NOT NULL,
  issuer text NOT NULL,
  issue_date date NOT NULL,
  expiry_date date,
  verification_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_provider ON reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_service_areas_zipcode ON service_areas(zipcode);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Users policies
  DROP POLICY IF EXISTS "Admin can view all users" ON users;
  DROP POLICY IF EXISTS "Users can view their own data" ON users;
  
  -- Service Providers policies
  DROP POLICY IF EXISTS "Providers can manage their own profile" ON service_providers;
  DROP POLICY IF EXISTS "Public can view provider profiles" ON service_providers;
  
  -- Customers policies
  DROP POLICY IF EXISTS "Customers can manage their own profile" ON customers;
  
  -- Bookings policies
  DROP POLICY IF EXISTS "Customers can view and manage their bookings" ON bookings;
  DROP POLICY IF EXISTS "Providers can view and update assigned bookings" ON bookings;
  
  -- Reviews policies
  DROP POLICY IF EXISTS "Customers can create and view reviews" ON reviews;
  DROP POLICY IF EXISTS "Providers can view their reviews" ON reviews;
  
  -- Service Areas policies
  DROP POLICY IF EXISTS "Providers can manage their service areas" ON service_areas;
  DROP POLICY IF EXISTS "Public can view service areas" ON service_areas;
  
  -- Certifications policies
  DROP POLICY IF EXISTS "Providers can manage their certifications" ON certifications;
  DROP POLICY IF EXISTS "Public can view certifications" ON certifications;
END $$;

-- Create RLS Policies

-- Users policies
CREATE POLICY "Admin can view all users"
  ON users
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users users_1
    WHERE users_1.id = auth.uid()
    AND users_1.role = 'admin'
  ));

CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Service Providers policies
CREATE POLICY "Providers can manage their own profile"
  ON service_providers
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Public can view provider profiles"
  ON service_providers
  FOR SELECT
  TO authenticated
  USING (true);

-- Customers policies
CREATE POLICY "Customers can manage their own profile"
  ON customers
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Bookings policies
CREATE POLICY "Customers can view and manage their bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM customers
    WHERE customers.id = bookings.customer_id
    AND customers.user_id = auth.uid()
  ));

CREATE POLICY "Providers can view and update assigned bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM service_providers
    WHERE service_providers.id = bookings.provider_id
    AND service_providers.user_id = auth.uid()
  ));

-- Reviews policies
CREATE POLICY "Customers can create and view reviews"
  ON reviews
  FOR ALL
  TO authenticated
  USING (customer_id IN (
    SELECT id FROM customers
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Providers can view their reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (provider_id IN (
    SELECT id FROM service_providers
    WHERE user_id = auth.uid()
  ));

-- Service Areas policies
CREATE POLICY "Providers can manage their service areas"
  ON service_areas
  FOR ALL
  TO authenticated
  USING (provider_id IN (
    SELECT id FROM service_providers
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Public can view service areas"
  ON service_areas
  FOR SELECT
  TO authenticated
  USING (true);

-- Certifications policies
CREATE POLICY "Providers can manage their certifications"
  ON certifications
  FOR ALL
  TO authenticated
  USING (provider_id IN (
    SELECT id FROM service_providers
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Public can view certifications"
  ON certifications
  FOR SELECT
  TO authenticated
  USING (true);