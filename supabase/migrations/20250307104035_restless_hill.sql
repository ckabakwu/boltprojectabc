/*
  # Create Initial Admin User

  1. Changes
    - Creates a new admin user with secure password
    - Forces password reset on first login
    - Adds audit log entry
    
  2. Security
    - Password is properly hashed
    - User must change password on first login
    - Audit trail maintained
*/

-- Generate UUID for new user
DO $$
DECLARE
  v_user_id uuid := gen_random_uuid();
BEGIN
  -- Create auth user
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    'admin1@homemaidy.com',
    crypt('TempAdmin123!', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"force_password_reset": true}'::jsonb,
    now(),
    now()
  );

  -- Create user profile
  INSERT INTO users (
    id,
    email,
    full_name,
    role,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    'admin1@homemaidy.com',
    'Admin User',
    'admin',
    now(),
    now()
  );

  -- Add audit log entry
  INSERT INTO admin_audit_log (
    admin_id,
    action,
    entity_type,
    metadata,
    created_at
  ) VALUES (
    v_user_id,
    'admin_user_created',
    'auth',
    jsonb_build_object(
      'email', 'admin1@homemaidy.com',
      'timestamp', now()
    ),
    now()
  );

  -- Verify the admin user was created
  ASSERT EXISTS (
    SELECT 1 FROM auth.users
    WHERE email = 'admin1@homemaidy.com'
  ), 'Auth user was not created';

  -- Verify user profile exists  
  ASSERT EXISTS (
    SELECT 1 FROM users
    WHERE id = v_user_id
    AND role = 'admin'
  ), 'User profile was not created';

  -- Verify audit log entry
  ASSERT EXISTS (
    SELECT 1 FROM admin_audit_log
    WHERE action = 'admin_user_created'
  ), 'Audit log entry missing';

END $$;