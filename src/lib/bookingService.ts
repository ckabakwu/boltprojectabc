import { supabase } from './supabase';
import { createPaymentIntent, processPayment } from './stripe';
import { emailService } from './emailService';
import { bookingTemplates } from './emailTemplates';
import mixpanel from './analytics';

export interface BookingDetails {
  service: string;
  date: string;
  time: string;
  address: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  extras: string[];
  specialInstructions?: string;
  amount: number;
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

  public async checkAvailability(date: string, time: string, zipCode: string): Promise<boolean> {
    try {
      // In development, always return true
      if (import.meta.env.DEV) {
        return true;
      }

      // Check provider availability
      const { data: providers, error: providersError } = await supabase
        .from('service_providers')
        .select('id')
        .eq('available', true)
        .eq('active', true)
        .in('service_areas.zipcode', [zipCode]);

      if (providersError) throw providersError;

      // Check existing bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id')
        .eq('date', date)
        .eq('time', time)
        .in('provider_id', providers.map(p => p.id));

      if (bookingsError) throw bookingsError;

      // Return true if there are available providers
      return providers.length > bookings.length;
    } catch (error) {
      console.warn('Error checking availability:', error);
      // In case of error, return true to allow booking attempt
      return true;
    }
  }

  public async createBooking(details: BookingDetails, userId: string): Promise<string> {
    try {
      // Start transaction
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([
          {
            customer_id: userId,
            service_type: details.service,
            scheduled_at: `${details.date} ${details.time}`,
            address: details.address,
            total_amount: details.amount,
            status: 'pending',
            notes: details.specialInstructions
          }
        ])
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create payment intent
      const { stripe, sessionId } = await createPaymentIntent(details.amount, booking.id);

      // Send confirmation email
      await this.sendBookingConfirmation(booking.id, details);

      // Track booking creation
      mixpanel.track('Booking Created', {
        bookingId: booking.id,
        service: details.service,
        amount: details.amount
      });

      return sessionId;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  public async confirmBooking(bookingId: string, sessionId: string): Promise<void> {
    try {
      // Process payment
      const paymentIntent = await processPayment(sessionId);
      
      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment failed');
      }

      // Update booking status
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: 'confirmed', payment_id: paymentIntent.id })
        .eq('id', bookingId);

      if (updateError) throw updateError;

      // Send confirmation email
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('*, customers(*)')
        .eq('id', bookingId)
        .single();

      if (bookingError) throw bookingError;

      await this.sendBookingConfirmation(bookingId, booking);

      // Track successful booking
      mixpanel.track('Booking Confirmed', {
        bookingId,
        paymentId: paymentIntent.id
      });
    } catch (error) {
      console.error('Error confirming booking:', error);
      throw error;
    }
  }

  private async sendBookingConfirmation(bookingId: string, details: any): Promise<void> {
    try {
      const template = bookingTemplates.confirmation({
        bookingId,
        service: details.service,
        date: details.date,
        time: details.time,
        address: details.address,
        amount: `$${details.amount}`
      });

      await emailService.sendEmail({
        to: details.customers.email,
        template,
        metadata: {
          type: 'booking_confirmation',
          bookingId
        }
      });
    } catch (error) {
      console.error('Error sending booking confirmation:', error);
      // Don't throw error to prevent booking process from failing
    }
  }
}

export const bookingService = BookingService.getInstance();