/*
  # Cancellation Fees and Penalties Schema Update

  1. New Features
    - Add cancellation fee tracking
    - Add automatic fee calculation
    - Add notification system for cancellations
    - Add penalty tracking for providers

  2. Security
    - Enable RLS on affected tables
    - Add policies for fee viewing and management

  3. Changes
    - Add cancellation fee columns to service_providers and bookings
    - Add triggers for fee calculation and notifications
    - Add policies for access control
*/

-- Add cancellation-related columns to service_providers
ALTER TABLE service_providers 
ADD COLUMN IF NOT EXISTS cancellation_fee_rate numeric(5,2) DEFAULT 25.00;

-- Add cancellation-related columns to bookings
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS cancellation_fee_amount numeric(10,2),
ADD COLUMN IF NOT EXISTS cancellation_reason text,
ADD COLUMN IF NOT EXISTS cancellation_time timestamptz;

-- Create function to calculate cancellation fee
CREATE OR REPLACE FUNCTION calculate_cancellation_fee(
  booking_id uuid
) RETURNS numeric AS $$
DECLARE
  booking_record RECORD;
  provider_record RECORD;
  hours_until_service interval;
  fee_percentage numeric;
BEGIN
  -- Get booking details
  SELECT * INTO booking_record 
  FROM bookings 
  WHERE id = booking_id;

  -- Get provider details
  SELECT * INTO provider_record 
  FROM service_providers 
  WHERE id = booking_record.provider_id;

  -- Calculate hours until service
  hours_until_service := booking_record.scheduled_at - now();

  -- Determine fee percentage based on cancellation window
  IF hours_until_service < interval '24 hours' THEN
    fee_percentage := provider_record.cancellation_fee_rate;
  ELSIF hours_until_service < interval '48 hours' THEN
    fee_percentage := provider_record.cancellation_fee_rate * 0.5;
  ELSIF hours_until_service < interval '72 hours' THEN
    fee_percentage := provider_record.cancellation_fee_rate * 0.25;
  ELSE
    fee_percentage := 0;
  END IF;

  -- Calculate fee amount
  RETURN ROUND((booking_record.total_amount * fee_percentage / 100)::numeric, 2);
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to handle booking cancellations
CREATE OR REPLACE FUNCTION handle_booking_cancellation()
RETURNS trigger AS $$
DECLARE
  fee_amount numeric;
BEGIN
  -- Only proceed if status is changing to cancelled
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    -- Set cancellation time
    NEW.cancellation_time := now();
    
    -- Calculate and set cancellation fee
    SELECT calculate_cancellation_fee(NEW.id) INTO fee_amount;
    NEW.cancellation_fee_amount := fee_amount;

    -- Create penalty record if applicable
    IF fee_amount > 0 THEN
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
        fee_amount,
        COALESCE(NEW.cancellation_reason, 'Late cancellation'),
        'pending'
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for booking cancellations
DROP TRIGGER IF EXISTS handle_booking_cancellation ON bookings;
CREATE TRIGGER handle_booking_cancellation
  BEFORE UPDATE OF status ON bookings
  FOR EACH ROW
  WHEN (NEW.status = 'cancelled' AND OLD.status != 'cancelled')
  EXECUTE FUNCTION handle_booking_cancellation();

-- Create function to notify about cancellation fees
CREATE OR REPLACE FUNCTION notify_about_cancellation()
RETURNS trigger AS $$
DECLARE
  customer_user_id uuid;
  provider_user_id uuid;
BEGIN
  -- Get customer user ID
  SELECT user_id INTO customer_user_id
  FROM customers
  WHERE id = NEW.customer_id;

  -- Get provider user ID if applicable
  IF NEW.provider_id IS NOT NULL THEN
    SELECT user_id INTO provider_user_id
    FROM service_providers
    WHERE id = NEW.provider_id;
  END IF;

  -- Create notification for customer
  INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    metadata
  ) VALUES (
    customer_user_id,
    'booking_cancelled',
    'Booking Cancellation Fee',
    CASE 
      WHEN NEW.cancellation_fee_amount > 0 
      THEN format('A cancellation fee of $%s has been applied to your booking', NEW.cancellation_fee_amount::text)
      ELSE 'Your booking has been cancelled with no fee'
    END,
    jsonb_build_object(
      'booking_id', NEW.id,
      'fee_amount', NEW.cancellation_fee_amount,
      'cancellation_time', NEW.cancellation_time
    )
  );

  -- Create notification for provider if applicable
  IF provider_user_id IS NOT NULL THEN
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      metadata
    ) VALUES (
      provider_user_id,
      'booking_cancelled',
      'Booking Cancelled',
      format('A booking for %s has been cancelled', NEW.scheduled_at::date::text),
      jsonb_build_object(
        'booking_id', NEW.id,
        'cancellation_time', NEW.cancellation_time
      )
    );
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for cancellation notifications
DROP TRIGGER IF EXISTS notify_about_cancellation_trigger ON bookings;
CREATE TRIGGER notify_about_cancellation_trigger
  AFTER UPDATE OF status ON bookings
  FOR EACH ROW
  WHEN (NEW.status = 'cancelled' AND OLD.status != 'cancelled')
  EXECUTE FUNCTION notify_about_cancellation();

-- Enable RLS on bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings table
CREATE POLICY "Customers can view and cancel their bookings"
ON bookings
FOR ALL
TO authenticated
USING (
  customer_id IN (
    SELECT id FROM customers 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  customer_id IN (
    SELECT id FROM customers 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Providers can view their bookings"
ON bookings
FOR SELECT
TO authenticated
USING (
  provider_id IN (
    SELECT id FROM service_providers 
    WHERE user_id = auth.uid()
  )
);

-- Enable RLS on pro_penalties table
ALTER TABLE pro_penalties ENABLE ROW LEVEL SECURITY;

-- Create policies for pro_penalties table
CREATE POLICY "Providers can view their penalties"
ON pro_penalties
FOR SELECT
TO authenticated
USING (
  provider_id IN (
    SELECT id FROM service_providers 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage penalties"
ON pro_penalties
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);