import { supabase } from './supabase';
import { emailService } from './emailService';
import { stripePromise } from './stripe';
import { bookingService } from './bookingService';
import { passwordService } from './passwordService';
import mixpanel from './analytics';

interface APICheck {
  endpoint: string;
  status: 'healthy' | 'degraded' | 'error';
  responseTime: number;
  lastChecked: Date;
  error?: string;
}

class APIMonitor {
  private static instance: APIMonitor;
  private checks: Map<string, APICheck> = new Map();
  private checkInterval: number = 5 * 60 * 1000; // 5 minutes
  private intervalId?: number;

  private constructor() {}

  public static getInstance(): APIMonitor {
    if (!APIMonitor.instance) {
      APIMonitor.instance = new APIMonitor();
    }
    return APIMonitor.instance;
  }

  public async startMonitoring() {
    await this.runChecks();
    this.intervalId = window.setInterval(() => this.runChecks(), this.checkInterval);
  }

  public stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private async runChecks() {
    await Promise.all([
      this.checkDatabase(),
      this.checkAuth(),
      this.checkEmail(),
      this.checkPayments(),
      this.checkBookings(),
      this.checkAnalytics()
    ]);
  }

  private async checkDatabase() {
    const start = Date.now();
    try {
      // Test basic query
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .single();

      if (error) throw error;

      // Log health check
      const { error: logError } = await supabase
        .from('api_health_checks')
        .insert([{
          endpoint: 'database',
          status: 'healthy',
          response_time: Date.now() - start
        }]);

      if (logError) {
        console.warn('Failed to log health check:', logError);
      }

      this.updateCheck('database', {
        status: 'healthy',
        responseTime: Date.now() - start
      });
    } catch (error) {
      // Log failed health check
      const { error: logError } = await supabase
        .from('api_health_checks')
        .insert([{
          endpoint: 'database',
          status: 'error',
          response_time: Date.now() - start,
          error: error.message
        }]);

      if (logError) {
        console.warn('Failed to log health check:', logError);
      }

      this.updateCheck('database', {
        status: 'error',
        responseTime: Date.now() - start,
        error: error.message
      });
    }
  }

  // Fix: Change method declaration to use arrow function
  private checkAuth = async (): Promise<void> => {
    const start = Date.now();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Test password validation
      const passwordValid = await passwordService.validatePassword('Test123!@#');

      // Log health check
      const { error: logError } = await supabase
        .from('api_health_checks')
        .insert([{
          endpoint: 'auth',
          status: 'healthy',
          response_time: Date.now() - start
        }]);

      if (logError) {
        console.warn('Failed to log health check:', logError);
      }

      this.updateCheck('auth', {
        status: 'healthy',
        responseTime: Date.now() - start
      });
    } catch (error) {
      // Log failed health check
      const { error: logError } = await supabase
        .from('api_health_checks')
        .insert([{
          endpoint: 'auth',
          status: 'error',
          response_time: Date.now() - start,
          error: error.message
        }]);

      if (logError) {
        console.warn('Failed to log health check:', logError);
      }

      this.updateCheck('auth', {
        status: 'error',
        responseTime: Date.now() - start,
        error: error.message
      });
    }
  }

  private async checkEmail() {
    const start = Date.now();
    try {
      const testResult = await emailService.sendEmail({
        to: 'test@example.com',
        template: {
          subject: 'API Health Check',
          html: '<p>Test email</p>',
          text: 'Test email'
        }
      });

      // Log health check
      const { error: logError } = await supabase
        .from('api_health_checks')
        .insert([{
          endpoint: 'email',
          status: testResult ? 'healthy' : 'error',
          response_time: Date.now() - start
        }]);

      if (logError) {
        console.warn('Failed to log health check:', logError);
      }

      this.updateCheck('email', {
        status: testResult ? 'healthy' : 'error',
        responseTime: Date.now() - start
      });
    } catch (error) {
      // Log failed health check
      const { error: logError } = await supabase
        .from('api_health_checks')
        .insert([{
          endpoint: 'email',
          status: 'error',
          response_time: Date.now() - start,
          error: error.message
        }]);

      if (logError) {
        console.warn('Failed to log health check:', logError);
      }

      this.updateCheck('email', {
        status: 'error',
        responseTime: Date.now() - start,
        error: error.message
      });
    }
  }

  private async checkPayments() {
    const start = Date.now();
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');

      // Log health check
      const { error: logError } = await supabase
        .from('api_health_checks')
        .insert([{
          endpoint: 'payments',
          status: 'healthy',
          response_time: Date.now() - start
        }]);

      if (logError) {
        console.warn('Failed to log health check:', logError);
      }

      this.updateCheck('payments', {
        status: 'healthy',
        responseTime: Date.now() - start
      });
    } catch (error) {
      // Log failed health check
      const { error: logError } = await supabase
        .from('api_health_checks')
        .insert([{
          endpoint: 'payments',
          status: 'error',
          response_time: Date.now() - start,
          error: error.message
        }]);

      if (logError) {
        console.warn('Failed to log health check:', logError);
      }

      this.updateCheck('payments', {
        status: 'error',
        responseTime: Date.now() - start,
        error: error.message
      });
    }
  }

  private async checkBookings() {
    const start = Date.now();
    try {
      const availability = await bookingService.checkAvailability(
        new Date().toISOString().split('T')[0],
        '10:00',
        '12345'
      );

      // Log health check
      const { error: logError } = await supabase
        .from('api_health_checks')
        .insert([{
          endpoint: 'bookings',
          status: 'healthy',
          response_time: Date.now() - start
        }]);

      if (logError) {
        console.warn('Failed to log health check:', logError);
      }

      this.updateCheck('bookings', {
        status: 'healthy',
        responseTime: Date.now() - start
      });
    } catch (error) {
      // Log failed health check
      const { error: logError } = await supabase
        .from('api_health_checks')
        .insert([{
          endpoint: 'bookings',
          status: 'error',
          response_time: Date.now() - start,
          error: error.message
        }]);

      if (logError) {
        console.warn('Failed to log health check:', logError);
      }

      this.updateCheck('bookings', {
        status: 'error',
        responseTime: Date.now() - start,
        error: error.message
      });
    }
  }

  private async checkAnalytics() {
    const start = Date.now();
    try {
      mixpanel.track('API Health Check');

      // Log health check
      const { error: logError } = await supabase
        .from('api_health_checks')
        .insert([{
          endpoint: 'analytics',
          status: 'healthy',
          response_time: Date.now() - start
        }]);

      if (logError) {
        console.warn('Failed to log health check:', logError);
      }

      this.updateCheck('analytics', {
        status: 'healthy',
        responseTime: Date.now() - start
      });
    } catch (error) {
      // Log failed health check
      const { error: logError } = await supabase
        .from('api_health_checks')
        .insert([{
          endpoint: 'analytics',
          status: 'error',
          response_time: Date.now() - start,
          error: error.message
        }]);

      if (logError) {
        console.warn('Failed to log health check:', logError);
      }

      this.updateCheck('analytics', {
        status: 'error',
        responseTime: Date.now() - start,
        error: error.message
      });
    }
  }

  private updateCheck(endpoint: string, check: Partial<APICheck>) {
    const existing = this.checks.get(endpoint) || {
      endpoint,
      status: 'healthy',
      responseTime: 0,
      lastChecked: new Date()
    };

    this.checks.set(endpoint, {
      ...existing,
      ...check,
      lastChecked: new Date()
    });
  }

  public getStatus(endpoint: string): APICheck | undefined {
    return this.checks.get(endpoint);
  }

  public getAllStatuses(): APICheck[] {
    return Array.from(this.checks.values());
  }

  public generateReport() {
    const statuses = this.getAllStatuses();
    const total = statuses.length;
    const healthy = statuses.filter(s => s.status === 'healthy').length;
    const degraded = statuses.filter(s => s.status === 'degraded').length;
    const error = statuses.filter(s => s.status === 'error').length;

    return {
      timestamp: new Date().toISOString(),
      summary: {
        total,
        healthy,
        degraded,
        error,
        availability: (healthy / total) * 100
      },
      endpoints: statuses,
      averageResponseTime: statuses.reduce((acc, s) => acc + s.responseTime, 0) / total,
      issues: statuses
        .filter(s => s.status !== 'healthy')
        .map(s => ({
          endpoint: s.endpoint,
          status: s.status,
          error: s.error,
          lastChecked: s.lastChecked
        }))
    };
  }
}

export const apiMonitor = APIMonitor.getInstance();