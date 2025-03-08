/*
  # Add Photo Support

  1. Changes
    - Add avatar_url column to users table
    - Create booking_photos table for job-related photos
    - Add RLS policies for photo access

  2. Security
    - Enable RLS on new table
    - Add policies for photo access control
*/

-- Add avatar_url to users if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE users ADD COLUMN avatar_url text;
  END IF;
END $$;

-- Create booking photos table
CREATE TABLE IF NOT EXISTS booking_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  url text NOT NULL,
  type text NOT NULL, -- 'review' or 'complaint'
  uploaded_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create indices
CREATE INDEX IF NOT EXISTS idx_booking_photos_booking ON booking_photos(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_photos_user ON booking_photos(uploaded_by);

-- Enable RLS
ALTER TABLE booking_photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view photos for their bookings"
  ON booking_photos
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = booking_photos.booking_id
      AND (
        b.customer_id IN (
          SELECT id FROM customers WHERE user_id = auth.uid()
        )
        OR
        b.provider_id IN (
          SELECT id FROM service_providers WHERE user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can upload photos for their bookings"
  ON booking_photos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = booking_photos.booking_id
      AND (
        b.customer_id IN (
          SELECT id FROM customers WHERE user_id = auth.uid()
        )
        OR
        b.provider_id IN (
          SELECT id FROM service_providers WHERE user_id = auth.uid()
        )
      )
    )
    AND uploaded_by = auth.uid()
  );

CREATE POLICY "Users can delete their own photos"
  ON booking_photos
  FOR DELETE
  TO authenticated
  USING (uploaded_by = auth.uid());

-- Create trigger to update user's updated_at when avatar changes
CREATE OR REPLACE FUNCTION update_user_avatar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_avatar_timestamp
  BEFORE UPDATE OF avatar_url ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_user_avatar_timestamp();