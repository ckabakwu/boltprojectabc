/*
  # Pro Performance Tracking Schema

  1. New Tables
    - pro_badges
      - Tracks achievement badges earned by pros
    - pro_penalties
      - Records penalties and violations
    - pro_performance_metrics
      - Stores detailed performance data

  2. Security
    - Enable RLS on all tables
    - Add policies for viewing/managing badges and penalties
    - Add policies for performance metrics

  3. Changes
    - Add performance tracking triggers
    - Add automated badge assignment
*/

-- Create pro badges table
CREATE TABLE IF NOT EXISTS pro_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES service_providers(id),
  badge_type text NOT NULL,
  level text NOT NULL,
  earned_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT pro_badges_type_check CHECK (
    badge_type = ANY(ARRAY[
      'completion_rate',
      'on_time',
      'top_rated',
      'veteran',
      'reliable',
      'customer_favorite'
    ])
  ),
  CONSTRAINT pro_badges_level_check CHECK (
    level = ANY(ARRAY['bronze', 'silver', 'gold', 'platinum'])
  )
);

-- Create pro penalties table
CREATE TABLE IF NOT EXISTS pro_penalties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES service_providers(id),
  booking_id uuid REFERENCES bookings(id),
  type text NOT NULL,
  amount numeric(10,2),
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT pro_penalties_type_check CHECK (
    type = ANY(ARRAY[
      'late_cancellation',
      'no_show',
      'late_arrival',
      'poor_quality',
      'policy_violation'
    ])
  ),
  CONSTRAINT pro_penalties_status_check CHECK (
    status = ANY(ARRAY['pending', 'approved', 'rejected', 'paid'])
  )
);

-- Create pro performance metrics table
CREATE TABLE IF NOT EXISTS pro_performance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES service_providers(id),
  period_start date NOT NULL,
  period_end date NOT NULL,
  total_jobs integer DEFAULT 0,
  completed_jobs integer DEFAULT 0,
  cancelled_jobs integer DEFAULT 0,
  on_time_arrivals integer DEFAULT 0,
  average_rating numeric(3,2),
  total_earnings numeric(10,2) DEFAULT 0,
  total_penalties numeric(10,2) DEFAULT 0,
  customer_satisfaction numeric(3,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT date_order CHECK (period_start <= period_end)
);

-- Create indices
CREATE INDEX IF NOT EXISTS idx_pro_badges_provider ON pro_badges(provider_id);
CREATE INDEX IF NOT EXISTS idx_pro_badges_type ON pro_badges(badge_type);
CREATE INDEX IF NOT EXISTS idx_pro_penalties_provider ON pro_penalties(provider_id);
CREATE INDEX IF NOT EXISTS idx_pro_penalties_status ON pro_penalties(status);
CREATE INDEX IF NOT EXISTS idx_pro_performance_provider ON pro_performance_metrics(provider_id);
CREATE INDEX IF NOT EXISTS idx_pro_performance_period ON pro_performance_metrics(period_start, period_end);

-- Enable RLS
ALTER TABLE pro_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_penalties ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Providers can view their own badges"
  ON pro_badges
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM service_providers
      WHERE service_providers.id = pro_badges.provider_id
      AND service_providers.user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can view their own penalties"
  ON pro_penalties
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM service_providers
      WHERE service_providers.id = pro_penalties.provider_id
      AND service_providers.user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can view their own metrics"
  ON pro_performance_metrics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM service_providers
      WHERE service_providers.id = pro_performance_metrics.provider_id
      AND service_providers.user_id = auth.uid()
    )
  );

-- Create function to calculate and update performance metrics
CREATE OR REPLACE FUNCTION update_pro_performance_metrics(
  provider_id uuid,
  start_date date,
  end_date date
)
RETURNS void AS $$
DECLARE
  metrics RECORD;
BEGIN
  -- Calculate metrics for the period
  WITH period_metrics AS (
    SELECT
      COUNT(*) as total_jobs,
      COUNT(*) FILTER (WHERE status = 'completed') as completed_jobs,
      COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_jobs,
      COUNT(*) FILTER (
        WHERE status = 'completed' 
        AND (metadata->>'arrived_on_time')::boolean = true
      ) as on_time_arrivals,
      ROUND(AVG(
        (SELECT rating FROM pro_ratings pr 
         WHERE pr.booking_id = b.id 
         AND pr.provider_id = b.provider_id)
      )::numeric, 2) as avg_rating,
      SUM(total_amount) as total_earnings,
      SUM(
        CASE 
          WHEN status = 'cancelled' AND 
               (metadata->>'cancellation_window')::interval < interval '24 hours'
          THEN total_amount * 0.25  -- 25% penalty for late cancellation
          ELSE 0
        END
      ) as total_penalties
    FROM bookings b
    WHERE b.provider_id = provider_id
    AND b.scheduled_at::date BETWEEN start_date AND end_date
  )
  SELECT * INTO metrics FROM period_metrics;

  -- Insert or update metrics
  INSERT INTO pro_performance_metrics (
    provider_id,
    period_start,
    period_end,
    total_jobs,
    completed_jobs,
    cancelled_jobs,
    on_time_arrivals,
    average_rating,
    total_earnings,
    total_penalties,
    customer_satisfaction
  )
  VALUES (
    provider_id,
    start_date,
    end_date,
    metrics.total_jobs,
    metrics.completed_jobs,
    metrics.cancelled_jobs,
    metrics.on_time_arrivals,
    metrics.avg_rating,
    metrics.total_earnings,
    metrics.total_penalties,
    metrics.avg_rating  -- Using rating as satisfaction for now
  )
  ON CONFLICT (provider_id, period_start, period_end)
  DO UPDATE SET
    total_jobs = EXCLUDED.total_jobs,
    completed_jobs = EXCLUDED.completed_jobs,
    cancelled_jobs = EXCLUDED.cancelled_jobs,
    on_time_arrivals = EXCLUDED.on_time_arrivals,
    average_rating = EXCLUDED.average_rating,
    total_earnings = EXCLUDED.total_earnings,
    total_penalties = EXCLUDED.total_penalties,
    customer_satisfaction = EXCLUDED.customer_satisfaction,
    updated_at = now();

  -- Award badges based on performance
  -- Completion Rate Badge
  IF metrics.completed_jobs >= 50 AND (metrics.completed_jobs::float / metrics.total_jobs::float) >= 0.95 THEN
    INSERT INTO pro_badges (provider_id, badge_type, level)
    VALUES (provider_id, 'completion_rate', 'gold')
    ON CONFLICT (provider_id, badge_type) DO UPDATE SET 
    level = 'gold',
    earned_at = now();
  END IF;

  -- On-Time Badge
  IF metrics.on_time_arrivals >= 30 AND (metrics.on_time_arrivals::float / metrics.completed_jobs::float) >= 0.9 THEN
    INSERT INTO pro_badges (provider_id, badge_type, level)
    VALUES (provider_id, 'on_time', 'gold')
    ON CONFLICT (provider_id, badge_type) DO UPDATE SET 
    level = 'gold',
    earned_at = now();
  END IF;

  -- Top Rated Badge
  IF metrics.avg_rating >= 4.8 AND metrics.completed_jobs >= 20 THEN
    INSERT INTO pro_badges (provider_id, badge_type, level)
    VALUES (provider_id, 'top_rated', 'gold')
    ON CONFLICT (provider_id, badge_type) DO UPDATE SET 
    level = 'gold',
    earned_at = now();
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to handle late cancellations
CREATE OR REPLACE FUNCTION handle_late_cancellation()
RETURNS trigger AS $$
BEGIN
  -- Check if cancellation is within 24 hours of scheduled time
  IF NEW.status = 'cancelled' AND 
     NEW.scheduled_at - now() < interval '24 hours' AND
     NEW.provider_id IS NOT NULL THEN
    
    -- Create penalty record
    INSERT INTO pro_penalties (
      provider_id,
      booking_id,
      type,
      amount,
      reason,
      status
    ) VALUES (
      NEW.provider_id,
      NEW.id,
      'late_cancellation',
      NEW.total_amount * 0.25,  -- 25% penalty
      'Cancellation within 24 hours of scheduled service',
      'pending'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for late cancellations
CREATE TRIGGER handle_booking_cancellation
  AFTER UPDATE OF status ON bookings
  FOR EACH ROW
  WHEN (OLD.status != 'cancelled' AND NEW.status = 'cancelled')
  EXECUTE FUNCTION handle_late_cancellation();

-- Create function to update performance metrics daily
CREATE OR REPLACE FUNCTION update_daily_performance_metrics()
RETURNS void AS $$
DECLARE
  provider RECORD;
BEGIN
  FOR provider IN SELECT id FROM service_providers LOOP
    PERFORM update_pro_performance_metrics(
      provider.id,
      current_date - interval '30 days',
      current_date
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;