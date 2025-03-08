/*
  # Page Architecture Schema Update

  1. New Tables
    - `navigation_items`: Stores navigation menu structure
    - `breadcrumbs`: Tracks user navigation history
    - `ui_preferences`: Stores user UI preferences
    - `ui_themes`: Manages theme configurations

  2. Security
    - Enable RLS on all tables
    - Add policies for secure access
    - Add appropriate indexes
*/

-- Navigation Items Table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS navigation_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id uuid REFERENCES navigation_items(id),
    title text NOT NULL,
    path text NOT NULL,
    icon text,
    order_index integer DEFAULT 0 NOT NULL,
    visible boolean DEFAULT true,
    requires_auth boolean DEFAULT false,
    allowed_roles text[],
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Breadcrumbs Table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS breadcrumbs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    path text NOT NULL,
    title text NOT NULL,
    visited_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- UI Preferences Table
DO $$ BEGIN
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
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- UI Themes Table
DO $$ BEGIN
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
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS
DO $$ BEGIN
  ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
  ALTER TABLE breadcrumbs ENABLE ROW LEVEL SECURITY;
  ALTER TABLE ui_preferences ENABLE ROW LEVEL SECURITY;
  ALTER TABLE ui_themes ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "public_view_navigation" ON navigation_items;
  DROP POLICY IF EXISTS "view_own_breadcrumbs" ON breadcrumbs;
  DROP POLICY IF EXISTS "manage_own_ui_preferences" ON ui_preferences;
  DROP POLICY IF EXISTS "admin_manage_ui_themes" ON ui_themes;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create new policies
DO $$ BEGIN
  CREATE POLICY "public_view_navigation" ON navigation_items
    FOR SELECT TO public
    USING (visible = true);

  CREATE POLICY "view_own_breadcrumbs" ON breadcrumbs
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

  CREATE POLICY "manage_own_ui_preferences" ON ui_preferences
    FOR ALL TO authenticated
    USING (user_id = auth.uid());

  CREATE POLICY "admin_manage_ui_themes" ON ui_themes
    FOR ALL TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.role = 'admin'
      )
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_navigation_items_parent ON navigation_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_navigation_items_path ON navigation_items(path);
CREATE INDEX IF NOT EXISTS idx_breadcrumbs_user ON breadcrumbs(user_id);
CREATE INDEX IF NOT EXISTS idx_breadcrumbs_path ON breadcrumbs(path);
CREATE INDEX IF NOT EXISTS idx_ui_preferences_user ON ui_preferences(user_id);