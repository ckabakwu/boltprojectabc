/*
  # Promotions and Dynamic Discounts System

  1. New Tables
    - promotions: For managing coupons and promotional offers
    - promotion_usage: For tracking coupon usage
    - dynamic_pricing: For AI-driven price adjustments
    - booking_trends: For analyzing booking patterns

  2. Security
    - Enable RLS on all tables
    - Add admin-only policies
    - Add customer usage policies

  3. Changes
    - Add promotion tracking
    - Add dynamic pricing rules
    - Add trend analysis
*/

-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  type text NOT NULL,
  value numeric NOT NULL,
  description text,
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  usage_limit integer,
  min_booking_amount numeric,
  max_discount_amount numeric,
  user_type text DEFAULT 'all',
  service_type text[] DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT promotions_type_check CHECK (
    type = ANY (ARRAY['percentage', 'fixed'])
  ),
  CONSTRAINT promotions_user_type_check CHECK (
    user_type = ANY (ARRAY['all', 'new', 'existing'])
  )
);

-- Create promotion usage table
CREATE TABLE IF NOT EXISTS promotion_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id uuid REFERENCES promotions(id),
  user_id uuid REFERENCES users(id),
  booking_id uuid REFERENCES bookings(id),
  discount_amount numeric NOT NULL,
  used_at timestamptz DEFAULT now()
);

-- Create dynamic pricing table
CREATE TABLE IF NOT EXISTS dynamic_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type text NOT NULL,
  location_id uuid REFERENCES service_locations(id),
  day_of_week integer,
  hour_of_day integer,
  multiplier numeric NOT NULL DEFAULT 1.0,
  min_multiplier numeric NOT NULL DEFAULT 0.8,
  max_multiplier numeric NOT NULL DEFAULT 1.5,
  last_updated timestamptz DEFAULT now(),
  CONSTRAINT dynamic_pricing_day_check CHECK (
    day_of_week BETWEEN 0 AND 6
  ),
  CONSTRAINT dynamic_pricing_hour_check CHECK (
    hour_of_day BETWEEN 0 AND 23
  )
);

-- Create booking trends table
CREATE TABLE IF NOT EXISTS booking_trends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type text NOT NULL,
  location_id uuid REFERENCES service_locations(id),
  date date NOT NULL,
  total_bookings integer DEFAULT 0,
  avg_price numeric DEFAULT 0,
  demand_score numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE dynamic_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_trends ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "admin_manage_promotions_policy"
  ON promotions
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "customers_view_active_promotions_policy"
  ON promotions
  FOR SELECT
  TO authenticated
  USING (
    active = true 
    AND (start_date <= now() AND (end_date IS NULL OR end_date >= now()))
    AND (user_type = 'all' OR (
      user_type = 'new' AND NOT EXISTS (
        SELECT 1 FROM bookings b
        JOIN customers c ON c.id = b.customer_id
        WHERE c.user_id = auth.uid()
      )
    ))
  );

CREATE POLICY "users_view_own_promotion_usage_policy"
  ON promotion_usage
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "admin_manage_dynamic_pricing_policy"
  ON dynamic_pricing
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "admin_manage_booking_trends_policy"
  ON booking_trends
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_promotions_code ON promotions(code);
CREATE INDEX IF NOT EXISTS idx_promotions_dates ON promotions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(active);
CREATE INDEX IF NOT EXISTS idx_promotion_usage_user ON promotion_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_promotion_usage_promotion ON promotion_usage(promotion_id);
CREATE INDEX IF NOT EXISTS idx_dynamic_pricing_service ON dynamic_pricing(service_type);
CREATE INDEX IF NOT EXISTS idx_dynamic_pricing_location ON dynamic_pricing(location_id);
CREATE INDEX IF NOT EXISTS idx_booking_trends_date ON booking_trends(date);
CREATE INDEX IF NOT EXISTS idx_booking_trends_location ON booking_trends(location_id);

-- Create function to validate promotion
CREATE OR REPLACE FUNCTION validate_promotion(
  p_code text,
  p_user_id uuid,
  p_booking_amount numeric
) RETURNS TABLE (
  valid boolean,
  discount_amount numeric,
  error_message text
) AS $$
BEGIN
  RETURN QUERY
  WITH promotion AS (
    SELECT *
    FROM promotions
    WHERE code = p_code
      AND active = true
      AND start_date <= now()
      AND (end_date IS NULL OR end_date >= now())
  )
  SELECT
    CASE
      WHEN NOT EXISTS (SELECT 1 FROM promotion) THEN false
      WHEN (SELECT usage_limit FROM promotion) IS NOT NULL 
        AND (SELECT COUNT(*) FROM promotion_usage pu WHERE pu.promotion_id = promotion.id) >= (SELECT usage_limit FROM promotion) THEN false
      WHEN (SELECT min_booking_amount FROM promotion) > p_booking_amount THEN false
      WHEN (SELECT user_type FROM promotion) = 'new' 
        AND EXISTS (SELECT 1 FROM bookings b JOIN customers c ON c.id = b.customer_id WHERE c.user_id = p_user_id) THEN false
      ELSE true
    END as valid,
    CASE
      WHEN (SELECT type FROM promotion) = 'percentage' THEN
        LEAST(
          p_booking_amount * (SELECT value FROM promotion) / 100,
          COALESCE((SELECT max_discount_amount FROM promotion), p_booking_amount)
        )
      ELSE
        LEAST(
          (SELECT value FROM promotion),
          p_booking_amount
        )
    END as discount_amount,
    CASE
      WHEN NOT EXISTS (SELECT 1 FROM promotion) THEN 'Invalid promotion code'
      WHEN (SELECT usage_limit FROM promotion) IS NOT NULL 
        AND (SELECT COUNT(*) FROM promotion_usage pu WHERE pu.promotion_id = promotion.id) >= (SELECT usage_limit FROM promotion) THEN 'Promotion usage limit reached'
      WHEN (SELECT min_booking_amount FROM promotion) > p_booking_amount THEN 'Booking amount too low for this promotion'
      WHEN (SELECT user_type FROM promotion) = 'new' 
        AND EXISTS (SELECT 1 FROM bookings b JOIN customers c ON c.id = b.customer_id WHERE c.user_id = p_user_id) THEN 'Promotion only valid for new customers'
      ELSE NULL
    END as error_message
  FROM promotion;
END;
$$ LANGUAGE plpgsql;

-- Create function to update dynamic pricing
CREATE OR REPLACE FUNCTION update_dynamic_pricing() RETURNS void AS $$
BEGIN
  -- Calculate demand score based on recent bookings
  INSERT INTO booking_trends (
    service_type,
    location_id,
    date,
    total_bookings,
    avg_price,
    demand_score
  )
  SELECT
    b.service_type,
    sa.id as location_id,
    DATE(b.scheduled_at) as date,
    COUNT(*) as total_bookings,
    AVG(b.total_amount) as avg_price,
    COUNT(*) / 
    GREATEST(
      (SELECT COUNT(*) FROM bookings b2 
       WHERE DATE(b2.scheduled_at) = DATE(b.scheduled_at) - interval '1 week'),
      1
    ) as demand_score
  FROM bookings b
  JOIN service_areas sa ON ST_Contains(sa.boundary, ST_SetSRID(ST_Point(b.longitude, b.latitude), 4326))
  WHERE b.scheduled_at >= now() - interval '30 days'
  GROUP BY b.service_type, sa.id, DATE(b.scheduled_at);

  -- Update dynamic pricing multipliers
  UPDATE dynamic_pricing dp
  SET 
    multiplier = GREATEST(
      LEAST(
        1.0 + (0.1 * (
          SELECT AVG(demand_score - 1)
          FROM booking_trends bt
          WHERE bt.service_type = dp.service_type
          AND bt.location_id = dp.location_id
          AND bt.date >= now() - interval '7 days'
        )),
        dp.max_multiplier
      ),
      dp.min_multiplier
    ),
    last_updated = now()
  WHERE EXISTS (
    SELECT 1
    FROM booking_trends bt
    WHERE bt.service_type = dp.service_type
    AND bt.location_id = dp.location_id
    AND bt.date >= now() - interval '7 days'
  );
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update dynamic pricing daily
CREATE OR REPLACE FUNCTION trigger_update_dynamic_pricing()
RETURNS trigger AS $$
BEGIN
  PERFORM update_dynamic_pricing();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER daily_price_update
  AFTER INSERT OR UPDATE ON bookings
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_update_dynamic_pricing();