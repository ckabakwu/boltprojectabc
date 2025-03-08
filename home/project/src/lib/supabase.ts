import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://YOUR-PROJECT-ID.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsY29jdWFudGptenRraHNvZmxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMjcyODgsImV4cCI6MjA1NjcwMzI4OH0.RJ9t4v0QZKRPg70fX_ueh36nCMVj3x4jTTGwA5gGHoc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
