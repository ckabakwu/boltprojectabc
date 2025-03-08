/*
  # Delete User Credentials

  1. Changes
    - Safely removes all user authentication data while preserving profiles
    - Clears temporary admin credentials and sessions
    - Resets password-related data
    - Maintains audit trail
    
  2. Security
    - Preserves row level security policies
    - Maintains referential integrity
    - Keeps audit logs of the operation
    
  3. Important Notes
    - Users will need to reset their passwords
    - Admin accounts will need to be recreated
    - User profiles and relationships remain intact
*/

-- Start a transaction to ensure data consistency
BEGIN;

-- Clear auth.users table while preserving references
UPDATE auth.users
SET 
  encrypted_password = NULL,
  email_confirmed_at = NULL,
  confirmation_sent_at = NULL,
  recovery_sent_at = NULL,
  last_sign_in_at = NULL,
  raw_app_meta_data = '{}'::jsonb,
  raw_user_meta_data = '{}'::jsonb,
  updated_at = NOW();

-- Clear temporary admin credentials
TRUNCATE TABLE temp_admin_auth CASCADE;

-- Clear password reset tokens
TRUNCATE TABLE password_resets CASCADE;

-- Clear temporary credentials
TRUNCATE TABLE temp_credentials CASCADE;

-- Clear two factor auth data
UPDATE two_factor_auth
SET 
  secret = NULL,
  backup_codes = NULL,
  updated_at = NOW();

-- Clear auth sessions
TRUNCATE TABLE auth_sessions CASCADE;

-- Clear auth attempts
TRUNCATE TABLE auth_attempts CASCADE;

-- Add audit log entry
INSERT INTO admin_audit_log (
  action,
  entity_type,
  changes,
  created_at
) VALUES (
  'credentials_reset',
  'auth',
  jsonb_build_object(
    'description', 'All user credentials cleared',
    'timestamp', now()
  ),
  NOW()
);

COMMIT;

-- Verify the changes
DO $$
BEGIN
  -- Verify auth data was cleared
  ASSERT (
    SELECT COUNT(*) = 0 
    FROM auth.users 
    WHERE encrypted_password IS NOT NULL
  ), 'Auth data was not properly cleared';
  
  -- Verify user profiles still exist
  ASSERT (
    SELECT COUNT(*) > 0
    FROM users
  ), 'User profiles were incorrectly removed';
  
  -- Verify audit log entry was created
  ASSERT (
    SELECT COUNT(*) > 0 
    FROM admin_audit_log 
    WHERE action = 'credentials_reset'
  ), 'Audit log entry missing';
END $$;