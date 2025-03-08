import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

// Initialize Stripe with publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Validate Stripe initialization
if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
  console.warn('Stripe publishable key not found in environment variables');
}

// Payment Intent functions
export const createPaymentIntent = async (amount: number, bookingId: string) => {
  try {
    const { data: { session_id }, error } = await supabase.functions.invoke('create-payment-intent', {
      body: { amount, bookingId }
    });

    if (error) throw error;

    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to initialize');

    return { stripe, sessionId: session_id };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export const processPayment = async (sessionId: string) => {
  try {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to initialize');

    const { paymentIntent } = await stripe.retrievePaymentIntent(sessionId);
    return paymentIntent;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};

// Setup Intent functions
export const createSetupIntent = async () => {
  try {
    const { data: { client_secret }, error } = await supabase.functions.invoke('create-setup-intent');
    
    if (error) throw error;
    return client_secret;
  } catch (error) {
    console.error('Error creating setup intent:', error);
    throw error;
  }
};

export const savePaymentMethod = async (paymentMethodId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('save-payment-method', {
      body: { paymentMethodId }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving payment method:', error);
    throw error;
  }
};

export { stripePromise };