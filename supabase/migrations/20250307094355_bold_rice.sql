/*
  # Job Notifications Schema

  1. New Tables
    - job_notifications
      - Tracks notifications sent to pros about available jobs
    - job_boost_history  
      - Records when jobs have had their rates boosted
    - pro_job_preferences
      - Stores pro preferences for job matching

  2. Security
    - Enable RLS on all tables
    - Add policies for pros to view/manage their notifications
    - Add policies for admins to manage all records

  3. Changes
    - Add notification preferences to service_providers table
    - Add boost_rate column to bookings table
*/

-- Create job notifications table
CREATE TABLE IF NOT EXISTS job_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id),
  provider_id uuid NOT NULL REFERENCES service_providers(id),
  type text NOT NULL CHECK (type IN ('email', 'push', 'sms')),
  status text NOT NULL CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at timestamptz,
  error text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create job boost history table
CREATE TABLE IF NOT EXISTS job_boost_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id),
  boost_amount numeric(10,2) NOT NULL CHECK (boost_amount > 0),
  reason text NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

-- Create pro job preferences table
CREATE TABLE IF NOT EXISTS pro_job_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES service_providers(id),
  max_distance integer NOT NULL DEFAULT 40 CHECK (max_distance > 0),
  min_job_amount numeric(10,2),
  preferred_job_types text[],
  break_duration interval DEFAULT '00:30:00'::interval,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add notification preferences to service providers
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'service_providers' AND column_name = 'notification_preferences'
  ) THEN
    ALTER TABLE service_providers 
    ADD COLUMN notification_preferences jsonb DEFAULT '{"email": true, "push": true, "sms": true}'::jsonb;
  END IF;
END $$;

-- Add boost rate to bookings
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'boost_rate'
  ) THEN
    ALTER TABLE bookings 
    ADD COLUMN boost_rate numeric(10,2) DEFAULT 0;
  END IF;
END $$;

-- Create indices
CREATE INDEX IF NOT EXISTS idx_job_notifications_booking ON job_notifications(booking_id);
CREATE INDEX IF NOT EXISTS idx_job_notifications_provider ON job_notifications(provider_id);
CREATE INDEX IF NOT EXISTS idx_job_notifications_status ON job_notifications(status);
CREATE INDEX IF NOT EXISTS idx_job_boost_history_booking ON job_boost_history(booking_id);
CREATE INDEX IF NOT EXISTS idx_pro_job_preferences_provider ON pro_job_preferences(provider_id);

-- Enable RLS
ALTER TABLE job_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_boost_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_job_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Providers can view their notifications"
  ON job_notifications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM service_providers
      WHERE service_providers.id = job_notifications.provider_id
      AND service_providers.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage job boosts"
  ON job_boost_history
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Providers can manage their job preferences"
  ON pro_job_preferences
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM service_providers
      WHERE service_providers.id = pro_job_preferences.provider_id
      AND service_providers.user_id = auth.uid()
    )
  );

-- Create function to find nearby available pros
CREATE OR REPLACE FUNCTION find_nearby_pros(
  booking_id uuid,
  max_distance integer DEFAULT 40
)
RETURNS TABLE (
  provider_id uuid,
  distance numeric,
  match_score numeric
) AS $$
DECLARE
  booking_record RECORD;
BEGIN
  -- Get booking details
  SELECT b.*, 
         ST_SetSRID(ST_MakePoint(
           (SELECT COALESCE(longitude, 0) FROM service_locations WHERE zipcode = b.zipcode LIMIT 1),
           (SELECT COALESCE(latitude, 0) FROM service_locations WHERE zipcode = b.zipcode LIMIT 1)
         ), 4326) as location
  INTO booking_record
  FROM bookings b
  WHERE b.id = booking_id;

  -- Return nearby available pros
  RETURN QUERY
  SELECT 
    sp.id as provider_id,
    ST_Distance(
      booking_record.location::geography,
      ST_SetSRID(ST_MakePoint(
        (SELECT COALESCE(longitude, 0) FROM service_locations WHERE zipcode = sa.zipcode LIMIT 1),
        (SELECT COALESCE(latitude, 0) FROM service_locations WHERE zipcode = sa.zipcode LIMIT 1)
      ), 4326)::geography
    ) / 1609.34 as distance, -- Convert meters to miles
    (
      CASE 
        WHEN sp.rating >= 4.5 THEN 100
        WHEN sp.rating >= 4.0 THEN 80
        WHEN sp.rating >= 3.5 THEN 60
        ELSE 40
      END +
      CASE
        WHEN sp.total_jobs >= 100 THEN 50
        WHEN sp.total_jobs >= 50 THEN 30
        WHEN sp.total_jobs >= 20 THEN 20
        ELSE 10
      END
    )::numeric as match_score
  FROM service_providers sp
  JOIN service_areas sa ON sa.provider_id = sp.id
  JOIN pro_job_preferences pjp ON pjp.provider_id = sp.id
  WHERE sp.available = true
    AND sa.active = true
    AND booking_record.service_type = ANY(pjp.preferred_job_types)
    AND (pjp.min_job_amount IS NULL OR booking_record.total_amount >= pjp.min_job_amount)
    AND ST_DWithin(
      booking_record.location::geography,
      ST_SetSRID(ST_MakePoint(
        (SELECT COALESCE(longitude, 0) FROM service_locations WHERE zipcode = sa.zipcode LIMIT 1),
        (SELECT COALESCE(latitude, 0) FROM service_locations WHERE zipcode = sa.zipcode LIMIT 1)
      ), 4326)::geography,
      max_distance * 1609.34 -- Convert miles to meters
    )
  ORDER BY match_score DESC, distance ASC;
END;
$$ LANGUAGE plpgsql;

-- Create function to automatically boost job rate
CREATE OR REPLACE FUNCTION auto_boost_job_rate()
RETURNS trigger AS $$
DECLARE
  hours_until_job interval;
  boost_amount numeric(10,2);
BEGIN
  -- Calculate hours until job
  hours_until_job := NEW.scheduled_at - now();
  
  -- If less than 24 hours until job and no provider assigned
  IF hours_until_job < interval '24 hours' AND NEW.provider_id IS NULL THEN
    -- Calculate boost amount (10% increase)
    boost_amount := NEW.total_amount * 0.10;
    
    -- Update booking with boost
    UPDATE bookings 
    SET boost_rate = boost_amount,
        total_amount = total_amount + boost_amount
    WHERE id = NEW.id;
    
    -- Record boost history
    INSERT INTO job_boost_history (
      booking_id,
      boost_amount,
      reason,
      created_by
    ) VALUES (
      NEW.id,
      boost_amount,
      'Auto-boost for unassigned job within 24 hours',
      auth.uid()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto boosting
CREATE TRIGGER auto_boost_unassigned_jobs
  AFTER INSERT OR UPDATE OF provider_id ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION auto_boost_job_rate();

-- Create function to notify nearby pros
CREATE OR REPLACE FUNCTION notify_nearby_pros()
RETURNS trigger AS $$
DECLARE
  pro RECORD;
BEGIN
  -- Find nearby pros
  FOR pro IN 
    SELECT * FROM find_nearby_pros(NEW.id)
    WHERE distance <= 40 -- Max 40 miles
    ORDER BY match_score DESC, distance ASC
    LIMIT 10 -- Notify top 10 matching pros
  LOOP
    -- Create notifications based on pro preferences
    INSERT INTO job_notifications (
      booking_id,
      provider_id,
      type,
      status,
      metadata
    )
    SELECT 
      NEW.id,
      pro.provider_id,
      unnest(ARRAY['email', 'push', 'sms']) as type,
      'pending',
      jsonb_build_object(
        'distance', round(pro.distance::numeric, 1),
        'match_score', pro.match_score,
        'boost_rate', NEW.boost_rate
      )
    FROM service_providers sp
    WHERE sp.id = pro.provider_id
    AND (sp.notification_preferences->type)::boolean = true;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for notifications
CREATE TRIGGER notify_pros_for_new_booking
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_nearby_pros();

-- Create function to update updated_at timestamp
CREATE TRIGGER update_pro_job_preferences_updated_at
  BEFORE UPDATE ON pro_job_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();