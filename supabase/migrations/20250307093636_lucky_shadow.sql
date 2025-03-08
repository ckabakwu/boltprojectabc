/*
  # Add Ratings, Tips and Preferred Pros Support

  1. New Tables
    - pro_ratings: Store service provider ratings and reviews
    - tips: Track tips for service providers
    - Add preferred_providers array to customers table

  2. Security
    - Enable RLS on new tables
    - Add policies for secure access control
    - Add audit logging for changes

  3. Changes
    - Add triggers for rating calculations
    - Add indices for performance
*/

-- Create pro ratings table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'pro_ratings') THEN
    CREATE TABLE pro_ratings (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      booking_id uuid NOT NULL REFERENCES bookings(id),
      provider_id uuid NOT NULL REFERENCES service_providers(id),
      customer_id uuid NOT NULL REFERENCES customers(id),
      rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
      review text,
      response text,
      response_date timestamptz,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      -- Ensure one rating per booking per customer-provider pair
      UNIQUE(booking_id, provider_id, customer_id)
    );
  END IF;
END $$;

-- Create tips table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'tips') THEN
    CREATE TABLE tips (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      booking_id uuid NOT NULL REFERENCES bookings(id),
      provider_id uuid NOT NULL REFERENCES service_providers(id),
      customer_id uuid NOT NULL REFERENCES customers(id),
      amount numeric(10,2) NOT NULL CHECK (amount > 0),
      status text NOT NULL CHECK (status IN ('pending', 'processed', 'failed')),
      payment_id text,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Add preferred_providers array to customers if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customers' AND column_name = 'preferred_providers'
  ) THEN
    ALTER TABLE customers ADD COLUMN preferred_providers uuid[] DEFAULT '{}'::uuid[];
  END IF;
END $$;

-- Create indices
CREATE INDEX IF NOT EXISTS idx_pro_ratings_provider ON pro_ratings(provider_id);
CREATE INDEX IF NOT EXISTS idx_pro_ratings_rating ON pro_ratings(rating);
CREATE INDEX IF NOT EXISTS idx_tips_provider ON tips(provider_id);
CREATE INDEX IF NOT EXISTS idx_tips_status ON tips(status);

-- Enable RLS
ALTER TABLE pro_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Customers can create ratings" ON pro_ratings;
  DROP POLICY IF EXISTS "Providers can respond to their ratings" ON pro_ratings;
  DROP POLICY IF EXISTS "Users can view pro ratings" ON pro_ratings;
  DROP POLICY IF EXISTS "Customers can create tips" ON tips;
  DROP POLICY IF EXISTS "Providers can view their tips" ON tips;
END $$;

-- Create RLS policies
CREATE POLICY "Customers can create ratings"
  ON pro_ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = pro_ratings.customer_id
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can respond to their ratings"
  ON pro_ratings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM service_providers
      WHERE service_providers.id = pro_ratings.provider_id
      AND service_providers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view pro ratings"
  ON pro_ratings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Customers can create tips"
  ON tips
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = tips.customer_id
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can view their tips"
  ON tips
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM service_providers
      WHERE service_providers.id = tips.provider_id
      AND service_providers.user_id = auth.uid()
    )
  );

-- Create trigger to update provider rating
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE service_providers
  SET rating = (
    SELECT ROUND(AVG(rating)::numeric, 2)
    FROM pro_ratings
    WHERE provider_id = NEW.provider_id
  )
  WHERE id = NEW.provider_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_pro_ratings_trigger ON pro_ratings;
DROP TRIGGER IF EXISTS audit_pro_ratings_changes ON pro_ratings;
DROP TRIGGER IF EXISTS update_pro_ratings_updated_at ON pro_ratings;

-- Create triggers
CREATE TRIGGER update_pro_ratings_trigger
  AFTER INSERT OR UPDATE ON pro_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_provider_rating();

CREATE TRIGGER audit_pro_ratings_changes
  AFTER INSERT OR DELETE OR UPDATE ON pro_ratings
  FOR EACH ROW
  EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER update_pro_ratings_updated_at
  BEFORE UPDATE ON pro_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();