/*
  # Navigation and Interface Schema Update

  1. New Tables
    - `navigation_items`: Stores navigation menu structure
    - `ui_preferences`: Stores user interface preferences
    - `breadcrumbs`: Stores breadcrumb navigation history
    - `ui_themes`: Stores theme configurations

  2. Security
    - Enable RLS on all tables
    - Add policies for secure access
*/

-- Navigation Items Table
CREATE TABLE IF NOT EXISTS navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES navigation_items(id),
  title text NOT NULL,
  path text NOT NULL,
  icon text,
  order_index integer NOT NULL DEFAULT 0,
  visible boolean DEFAULT true,
  requires_auth boolean DEFAULT false,
  allowed_roles text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- UI Preferences Table
CREATE TABLE IF NOT EXISTS ui_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  theme text DEFAULT 'light',
  sidebar_collapsed boolean DEFAULT false,
  notifications_position text DEFAULT 'top-right',
  font_size text DEFAULT 'medium',
  high_contrast boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Breadcrumbs Table
CREATE TABLE IF NOT EXISTS breadcrumbs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  path text NOT NULL,
  title text NOT NULL,
  visited_at timestamptz DEFAULT now()
);

-- UI Themes Table
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
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ui_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE breadcrumbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ui_themes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view active navigation items"
  ON navigation_items
  FOR SELECT
  TO public
  USING (visible = true);

CREATE POLICY "Users can manage their own UI preferences"
  ON ui_preferences
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their own breadcrumbs"
  ON breadcrumbs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage UI themes"
  ON ui_themes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_navigation_items_parent ON navigation_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_navigation_items_path ON navigation_items(path);
CREATE INDEX IF NOT EXISTS idx_ui_preferences_user ON ui_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_breadcrumbs_user ON breadcrumbs(user_id);
CREATE INDEX IF NOT EXISTS idx_breadcrumbs_path ON breadcrumbs(path);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_navigation_items_updated_at
  BEFORE UPDATE ON navigation_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ui_preferences_updated_at
  BEFORE UPDATE ON ui_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ui_themes_updated_at
  BEFORE UPDATE ON ui_themes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default navigation items
INSERT INTO navigation_items (title, path, icon, order_index, requires_auth, allowed_roles) VALUES
  ('Home', '/', 'Home', 0, false, NULL),
  ('Services', '/services', 'Sparkles', 1, false, NULL),
  ('About', '/about', 'Info', 2, false, NULL),
  ('Contact', '/contact', 'Mail', 3, false, NULL),
  ('Dashboard', '/customer-dashboard', 'Layout', 4, true, ARRAY['customer']),
  ('Pro Dashboard', '/pro-dashboard', 'Layout', 5, true, ARRAY['provider']),
  ('Admin', '/admin/dashboard', 'Shield', 6, true, ARRAY['admin']);

-- Insert default theme
INSERT INTO ui_themes (name, colors, fonts, spacing, active) VALUES
  ('Default Light', 
   '{"primary": "#2563eb", "secondary": "#4b5563", "accent": "#3b82f6"}',
   '{"body": "Inter", "headings": "Inter"}',
   '{"base": "1rem", "large": "1.5rem"}',
   true
  );