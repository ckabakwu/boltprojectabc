import mixpanel from 'mixpanel-browser';

// Get Mixpanel token from environment variables
const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;

// Initialize with proper error handling
if (!MIXPANEL_TOKEN) {
  console.warn('Mixpanel token not found in environment variables');
  // Create a mock implementation for analytics functions
  const noop = () => {};
  mixpanel.init('TEST_TOKEN', {
    debug: true,
    track_pageview: false,
    persistence: 'localStorage',
    ignore_dnt: true,
    api_host: 'https://api-js.mixpanel.com'
  });
  mixpanel.track = noop;
  mixpanel.identify = noop;
  mixpanel.people.set = noop;
  mixpanel.reset = noop;
} else {
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: import.meta.env.DEV,
    track_pageview: true,
    persistence: 'localStorage',
    api_host: 'https://api-js.mixpanel.com',
    ignore_dnt: true,
    batch_requests: true,
    batch_size: 50,
    batch_flush_interval_ms: 5000,
    loaded: (mixpanel) => {
      mixpanel.register({
        'App Version': '1.0.0',
        'Environment': import.meta.env.MODE
      });
    }
  });
}

// Track page views
export const trackPageView = (pageName: string) => {
  mixpanel.track('Page View', {
    page: pageName,
    url: window.location.href,
    referrer: document.referrer,
    timestamp: new Date().toISOString()
  });
};

// Track user sign up
export const trackSignUp = (userId: string, method: string) => {
  mixpanel.track('Sign Up', {
    userId,
    method,
    timestamp: new Date().toISOString()
  });
};

// Track user login
export const trackLogin = (userId: string, method: string) => {
  mixpanel.track('Login', {
    userId,
    method,
    timestamp: new Date().toISOString()
  });
};

// Track booking creation
export const trackBookingCreated = (bookingId: string, serviceType: string, amount: number) => {
  mixpanel.track('Booking Created', {
    bookingId,
    serviceType,
    amount,
    timestamp: new Date().toISOString()
  });
};

// Track booking completion
export const trackBookingCompleted = (bookingId: string, rating: number) => {
  mixpanel.track('Booking Completed', {
    bookingId,
    rating,
    timestamp: new Date().toISOString()
  });
};

// Track pro application
export const trackProApplication = (applicationId: string) => {
  mixpanel.track('Pro Application', {
    applicationId,
    timestamp: new Date().toISOString()
  });
};

// Track search
export const trackSearch = (query: string, results: number) => {
  mixpanel.track('Search', {
    query,
    results,
    timestamp: new Date().toISOString()
  });
};

// Identify user
export const identifyUser = (userId: string, traits: Record<string, any>) => {
  mixpanel.identify(userId);
  mixpanel.people.set({
    ...traits,
    $last_seen: new Date().toISOString()
  });
};

// Track error
export const trackError = (error: Error, context?: Record<string, any>) => {
  mixpanel.track('Error', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
};

// Reset user
export const resetUser = () => {
  mixpanel.reset();
};

export default mixpanel;