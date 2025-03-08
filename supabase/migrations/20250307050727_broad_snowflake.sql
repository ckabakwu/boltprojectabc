/*
  # Admin Authentication Setup

  1. New Tables
    - `temp_admin_auth`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `expires_at` (timestamptz)
      - `used` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on temp_admin_auth table
    - Add policy for admin access
    - Add cleanup trigger for expired records
*/

-- Create temp_admin_auth table
CREATE TABLE IF NOT EXISTS temp_admin_auth (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '48 hours'),
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE temp_admin_auth ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Only admins can access temp auth" ON temp_admin_auth;

-- Create new policy with a unique name
CREATE POLICY "admin_access_temp_auth_policy" ON temp_admin_auth
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  ));

-- Create function to clean up expired temp auth records
CREATE OR REPLACE FUNCTION trigger_cleanup_expired_temp_auth()
RETURNS trigger AS $$
BEGIN
  DELETE FROM temp_admin_auth 
  WHERE expires_at < now() 
  OR used = true;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS cleanup_expired_temp_auth_trigger ON temp_admin_auth;

-- Create trigger to cleanup expired records
CREATE TRIGGER cleanup_expired_temp_auth_trigger
  AFTER INSERT OR UPDATE ON temp_admin_auth
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_cleanup_expired_temp_auth();

-- Insert temporary admin credentials
INSERT INTO temp_admin_auth (email, password_hash)
VALUES ('admin@homemaidy.com', 'Admin123!@#')
ON CONFLICT (email) 
DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  expires_at = (now() + interval '48 hours'),
  used = false;