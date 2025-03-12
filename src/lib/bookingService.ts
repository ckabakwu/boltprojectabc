import { supabase } from './supabase';
import { emailService } from './emailService';
import { bookingTemplates } from './emailTemplates';
import mixpanel from './analytics';

export interface BookingDetails {
  user_id: string;
  service_type: string;
  scheduled_date: string;
  scheduled_time: string;
  address: string;
  zip_code: string;
  bedrooms?: number;
  bathrooms?: number;
  extras?: string[];
  special_instructions?: string;
  amount: number;
  square_footage?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

class BookingService {
  private static instance: BookingService;

  private constructor() {}

  public static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }
    return BookingService.instance;
  }

  private async ensureUserProfile(userId: string, email: string) {
    // Check if profile exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // If profile doesn't exist, create it
    if (!profile) {
      const { error } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            email: email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
    }
  }

  public async getUserBookings(userId: string) {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('scheduled_date', { ascending: true });

    if (error) throw error;
    return bookings;
  }

  public async getUpcomingBookings(userId: string) {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .gte('scheduled_date', new Date().toISOString().split('T')[0])
      .order('scheduled_date', { ascending: true });

    if (error) throw error;
    return bookings;
  }

  public async createBooking(bookingDetails: BookingDetails) {
    try {
      // First ensure user profile exists
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      await this.ensureUserProfile(user.id, user.email || '');

      // Then create the booking
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: bookingDetails.user_id,
            service_type: bookingDetails.service_type,
            scheduled_date: bookingDetails.scheduled_date,
            scheduled_time: bookingDetails.scheduled_time,
            address: bookingDetails.address,
            zip_code: bookingDetails.zip_code,
            bedrooms: bookingDetails.bedrooms,
            bathrooms: bookingDetails.bathrooms,
            extras: bookingDetails.extras,
            special_instructions: bookingDetails.special_instructions,
            amount: bookingDetails.amount,
            square_footage: bookingDetails.square_footage,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      mixpanel.track('Booking Created', {
        bookingId: data.id,
        serviceType: bookingDetails.service_type,
        amount: bookingDetails.amount
      });

      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  public async cancelBooking(bookingId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  public async getBookingById(bookingId: string) {
    console.log('Getting booking with ID:', bookingId);
    
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Verify user has access to this booking
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id !== booking.user_id) {
      throw new Error('Unauthorized access to booking');
    }

    return booking;
  }
}

export const bookingService = BookingService.getInstance();