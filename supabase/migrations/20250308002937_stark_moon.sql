/*
  # User Profile Creation Trigger

  1. New Tables
    - None (using existing users table)
  
  2. Security
    - Add trigger to automatically create user profiles
    - Add trigger to log user creation events
  
  3. Changes
    - Add trigger function for user profile creation
    - Add trigger function for user creation logging
*/

-- Function to create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log user creation
CREATE OR REPLACE FUNCTION public.log_user_creation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.account_creation_log (user_id, ip_address)
  VALUES (NEW.id, current_setting('request.headers')::json->>'x-real-ip');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new auth users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create trigger for logging user creation
CREATE TRIGGER log_user_creation_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.log_user_creation();