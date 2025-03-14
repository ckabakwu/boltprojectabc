import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gqyypwdxowyvgcaoktbu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxeXlwd2R4b3d5dmdjYW9rdGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzQyMDQsImV4cCI6MjA1NzQ1MDIwNH0.qFeYi-yfeyB3eodEqSyflL71SaNm2wXyRlD7noYQ_tE'
            

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
