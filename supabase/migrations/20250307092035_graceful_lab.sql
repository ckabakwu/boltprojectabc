/*
  # Points Tracking System

  1. New Tables
    - `loyalty_points`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `points` (integer)
      - `transaction_type` (text)
      - `description` (text)
      - `created_at` (timestamptz)
    - `loyalty_rewards`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `points_required` (integer)
      - `discount_amount` (numeric)
      - `active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Changes to Existing Tables
    - Add `referred_by` column to users table
    - Add `total_points` column to users table

  3. Security
    - Enable RLS on both tables
    - Add policies for users to view their own points
    - Add policies for admins to manage rewards
*/

-- Add referral tracking to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES users(id),
ADD COLUMN IF NOT EXISTS total_points integer DEFAULT 0;

-- Create loyalty_points table
CREATE TABLE IF NOT EXISTS loyalty_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  points integer NOT NULL,
  transaction_type text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create loyalty_rewards table
CREATE TABLE IF NOT EXISTS loyalty_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  points_required integer NOT NULL,
  discount_amount numeric NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_loyalty_points_user ON loyalty_points(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_type ON loyalty_points(transaction_type);
CREATE INDEX IF NOT EXISTS idx_loyalty_rewards_active ON loyalty_rewards(active);

-- Enable RLS
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_rewards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own points"
  ON loyalty_points
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view active rewards"
  ON loyalty_rewards
  FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Admins can manage rewards"
  ON loyalty_rewards
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Function to update user's total points
CREATE OR REPLACE FUNCTION update_user_total_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET total_points = (
    SELECT COALESCE(SUM(points), 0)
    FROM loyalty_points
    WHERE user_id = NEW.user_id
  )
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update total points
CREATE TRIGGER update_total_points
  AFTER INSERT OR UPDATE ON loyalty_points
  FOR EACH ROW
  EXECUTE FUNCTION update_user_total_points();

-- Add points tracking function
CREATE OR REPLACE FUNCTION add_points_for_booking()
RETURNS TRIGGER AS $$
BEGIN
  -- Add points for completed booking (100 points per booking)
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO loyalty_points (user_id, points, transaction_type, description)
    VALUES (
      NEW.customer_id,
      100,
      'booking_completed',
      'Points earned for completed booking #' || NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add points tracking trigger
CREATE TRIGGER track_booking_points
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION add_points_for_booking();

-- Add referral points function
CREATE OR REPLACE FUNCTION add_referral_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Add points for successful referral (200 points per referral)
  IF NEW.referred_by IS NOT NULL THEN
    INSERT INTO loyalty_points (user_id, points, transaction_type, description)
    VALUES (
      NEW.referred_by,
      200,
      'referral_bonus',
      'Points earned for referring a new user'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add referral points trigger
CREATE TRIGGER track_referral_points
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION add_referral_points();

-- Insert initial rewards
INSERT INTO loyalty_rewards (name, description, points_required, discount_amount)
VALUES 
  ('$10 Off Cleaning', 'Get $10 off your next cleaning service', 500, 10),
  ('$25 Off Deep Cleaning', 'Get $25 off a deep cleaning service', 1000, 25),
  ('Free Standard Cleaning', 'Get a free standard cleaning service', 2500, 120);