/*
  # Add Purge Test Data Function

  1. New Functions
    - `purge_test_data`: Function to safely remove test data from the system

  2. Security
    - Function is restricted to admin users only
    - Includes validation and safety checks
    - Maintains referential integrity

  3. Changes
    - Creates new stored procedure for data purging
    - Adds audit logging for purge operations
*/

-- Create function to purge test data
CREATE OR REPLACE FUNCTION purge_test_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
  v_admin_role text;
BEGIN
  -- Get current user ID and role
  v_user_id := auth.uid();
  SELECT role INTO v_admin_role FROM users WHERE id = v_user_id;
  
  -- Verify user is admin
  IF v_admin_role != 'admin' THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Begin transaction
  BEGIN
    -- Log purge operation start
    INSERT INTO admin_audit_log (
      admin_id,
      action,
      entity_type,
      metadata
    ) VALUES (
      v_user_id,
      'test_data_purge_started',
      'system',
      jsonb_build_object('timestamp', now())
    );

    -- Delete test bookings and related data
    DELETE FROM bookings 
    WHERE id IN (
      SELECT id FROM bookings 
      WHERE created_at > now() - interval '1 day'
      AND status = 'test'
    );

    -- Delete test reviews
    DELETE FROM reviews 
    WHERE id IN (
      SELECT id FROM reviews 
      WHERE created_at > now() - interval '1 day'
      AND comment LIKE '%test%'
    );

    -- Delete test payments
    DELETE FROM payment_transactions 
    WHERE id IN (
      SELECT id FROM payment_transactions 
      WHERE created_at > now() - interval '1 day'
      AND status = 'test'
    );

    -- Delete test user accounts
    DELETE FROM users 
    WHERE id IN (
      SELECT id FROM users 
      WHERE email LIKE '%test%'
      AND created_at > now() - interval '1 day'
    );

    -- Log successful purge
    INSERT INTO admin_audit_log (
      admin_id,
      action,
      entity_type,
      metadata
    ) VALUES (
      v_user_id,
      'test_data_purge_completed',
      'system',
      jsonb_build_object(
        'timestamp', now(),
        'status', 'success'
      )
    );

    -- Commit transaction
    COMMIT;
  EXCEPTION WHEN OTHERS THEN
    -- Log error and rollback
    INSERT INTO admin_audit_log (
      admin_id,
      action,
      entity_type,
      metadata
    ) VALUES (
      v_user_id,
      'test_data_purge_failed',
      'system',
      jsonb_build_object(
        'timestamp', now(),
        'error', SQLERRM,
        'status', 'error'
      )
    );
    RAISE;
  END;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION purge_test_data() TO authenticated;

-- Add RLS policy
CREATE POLICY "Allow admins to execute purge_test_data" 
  ON admin_audit_log
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );