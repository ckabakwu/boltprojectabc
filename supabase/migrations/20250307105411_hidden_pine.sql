/*
  # Create Temporary Admin User

  1. Changes
    - Creates a new admin user with temporary credentials
    - Sets up password reset request
    - Adds audit log entry
    
  2. Security
    - Password is properly hashed
    - Forces password change on first login
    - Maintains audit trail
*/

-- Start a transaction to ensure data consistency
BEGIN;

-- Create admin user
INSERT INTO users (
  email,
  full_name,
  role,
  created_at,
  updated_at
) VALUES (
  'admin2@homemaidy.com',
  'System Administrator',
  'admin',
  NOW(),
  NOW()
);

-- Create temporary admin credentials
INSERT INTO temp_admin_auth (
  email,
  password_hash,
  expires_at,
  used,
  created_at
) VALUES (
  'admin2@homemaidy.com',
  crypt('TempAdmin1234!', gen_salt('bf')),
  NOW() + INTERVAL '48 hours',
  false,
  NOW()
);

-- Add audit log entry
INSERT INTO admin_audit_log (
  action,
  entity_type,
  metadata,
  created_at
) VALUES (
  'temp_admin_created',
  'users',
  jsonb_build_object(
    'email', 'admin2@homemaidy.com',
    'expires_at', (NOW() + INTERVAL '48 hours')
  ),
  NOW()
);

-- Create password reset request
INSERT INTO password_reset_audit (
  email,
  status,
  expires_at,
  created_at
) VALUES (
  'admin2@homemaidy.com',
  'requested',
  NOW() + INTERVAL '48 hours',
  NOW()
);

COMMIT;

-- Verify the changes
DO $$
BEGIN
  -- Verify admin user was created
  ASSERT (
    SELECT COUNT(*) = 1 
    FROM users 
    WHERE email = 'admin2@homemaidy.com' AND role = 'admin'
  ), 'Admin user was not created';
  
  -- Verify temporary credentials exist
  ASSERT (
    SELECT COUNT(*) = 1 
    FROM temp_admin_auth 
    WHERE email = 'admin2@homemaidy.com' AND used = false
  ), 'Temporary credentials were not created';
  
  -- Verify password reset request
  ASSERT (
    SELECT COUNT(*) = 1 
    FROM password_reset_audit 
    WHERE email = 'admin2@homemaidy.com' AND status = 'requested'
  ), 'Password reset request not set';
  
  -- Verify audit log entry
  ASSERT (
    SELECT COUNT(*) = 1 
    FROM admin_audit_log 
    WHERE action = 'temp_admin_created'
  ), 'Audit log entry missing';
END $$;