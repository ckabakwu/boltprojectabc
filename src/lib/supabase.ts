import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Add a health check function
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .single();

    if (error) throw error;
    return { status: 'connected', error: null };
  } catch (error) {
    console.error('Supabase connection error:', error);
    return { status: 'error', error: error.message };
  }
};

// Type definitions for database tables
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'provider' | 'customer';
  avatar_url?: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  user_id: string;
  loyalty_points: number;
  total_bookings: number;
  preferred_providers: string[];
  created_at: string;
  updated_at: string;
}

export interface ServiceProvider {
  id: string;
  user_id: string;
  rating: number;
  total_jobs: number;
  available: boolean;
  hourly_rate: number;
  bio?: string;
  created_at: string;
  updated_at: string;
  notification_preferences: {
    sms: boolean;
    push: boolean;
    email: boolean;
  };
  cancellation_fee_rate: number;
}

export interface Booking {
  id: string;
  customer_id: string;
  provider_id?: string;
  service_type: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_at: string;
  completed_at?: string;
  address: string;
  total_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  boost_rate?: number;
  cancellation_fee_amount?: number;
  cancellation_reason?: string;
  cancellation_time?: string;
}

export interface ServiceArea {
  id: string;
  name: string;
  type: string;
  boundary: any; // GeoJSON geometry
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  score: number;
  created_at: string;
  updated_at: string;
  next_followup?: string;
}

export interface LeadStage {
  id: string;
  name: string;
  color: string;
}

export interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  provider_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface Promotion {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description?: string;
  start_date: string;
  end_date?: string;
  usage_limit?: number;
  min_booking_amount?: number;
  max_discount_amount?: number;
  user_type: 'all' | 'new' | 'existing';
  service_type?: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}

export default supabase;