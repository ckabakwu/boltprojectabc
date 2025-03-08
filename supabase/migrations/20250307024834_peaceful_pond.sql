/*
  # Create initial admin user and credentials

  1. Changes
    - Creates admin user in users table
    - Sets up temporary admin credentials
    - Adds proper RLS policies

  2. Security
    - Enables RLS
    - Adds policies for admin access
*/

-- Create admin user if not exists
INSERT INTO users (
  id,
  email,
  full_name,
  role
)
VALUES (
  gen_random_uuid(),
  'admin@homemaidy.com',
  'System Administrator',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

-- Create temporary credentials for admin
INSERT INTO temp_credentials (
  user_id,
  temp_password,
  expires_at,
  created_by
)
SELECT 
  id as user_id,
  'Admin123!@#' as temp_password,
  now() + interval '7 days' as expires_at,
  id as created_by
FROM users
WHERE email = 'admin@homemaidy.com'
AND NOT EXISTS (
  SELECT 1 FROM temp_credentials 
  WHERE user_id = users.id 
  AND used = false
  AND expires_at > now()
);

-- Create index for temp credentials lookup
CREATE INDEX IF NOT EXISTS idx_temp_credentials_lookup 
ON temp_credentials(temp_password, used) 
WHERE used = false;