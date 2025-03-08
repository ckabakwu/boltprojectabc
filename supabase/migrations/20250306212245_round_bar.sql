/*
  # UI Preferences and Themes Migration

  1. New Tables
    - `ui_preferences` for storing user interface preferences
    - `ui_themes` for storing theme configurations

  2. Security
    - Enable RLS on all tables
    - Add policies for user access

  3. Changes
    - Add responsive preferences support
    - Add theme management
*/

-- Drop existing triggers if they exist
DO $$ BEGIN
  DROP TRIGGER IF EXISTS update_ui_preferences_updated_at ON ui_preferences;
  DROP TRIGGER IF EXISTS update_ui_themes_updated_at ON ui_themes;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can manage their own UI preferences" ON ui_preferences;
  DROP POLICY IF EXISTS "Users can view active themes" ON ui_themes;
  DROP POLICY IF EXISTS "Admins can manage themes" ON ui_themes;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create ui_preferences table if it doesn't exist
CREATE TABLE IF NOT EXISTS ui_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  font_size text DEFAULT 'medium',
  high_contrast boolean DEFAULT false,
  reduced_motion boolean DEFAULT false,
  theme text DEFAULT 'light',
  notifications_position text DEFAULT 'top-right',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ui_themes table if it doesn't exist
CREATE TABLE IF NOT EXISTS ui_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  colors jsonb NOT NULL,
  fonts jsonb NOT NULL,
  spacing jsonb NOT NULL,
  active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE ui_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE ui_themes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own UI preferences"
  ON ui_preferences
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view active themes"
  ON ui_themes
  FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Admins can manage themes"
  ON ui_themes
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

-- Create update trigger for updated_at
CREATE TRIGGER update_ui_preferences_updated_at
  BEFORE UPDATE ON ui_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ui_themes_updated_at
  BEFORE UPDATE ON ui_themes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default theme if it doesn't exist
INSERT INTO ui_themes (
  name,
  colors,
  fonts,
  spacing,
  active
) 
SELECT 
  'Default',
  '{
    "primary": "#2563EB",
    "secondary": "#6B7280",
    "background": "#F9FAFB",
    "text": "#111827",
    "border": "#E5E7EB"
  }'::jsonb,
  '{
    "sans": "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif",
    "serif": "ui-serif, Georgia, Cambria, Times New Roman, Times, serif",
    "mono": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
    "sizes": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem"
    }
  }'::jsonb,
  '{
    "0": "0px",
    "1": "0.25rem",
    "2": "0.5rem",
    "3": "0.75rem",
    "4": "1rem",
    "6": "1.5rem",
    "8": "2rem",
    "12": "3rem",
    "16": "4rem"
  }'::jsonb,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM ui_themes WHERE name = 'Default'
);