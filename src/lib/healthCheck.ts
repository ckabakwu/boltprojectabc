import { supabase } from './supabase';
import { testAllIntegrations } from './integrationTests';
import { bookingService } from './bookingService';
import { emailService } from './emailService';
import { passwordService } from './passwordService';
import { stripePromise } from './stripe';

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'error';
  details: string;
  timestamp: string;
}

export async function performHealthCheck(): Promise<Record<string, HealthCheckResult>> {
  const results: Record<string, HealthCheckResult> = {};
  const timestamp = new Date().toISOString();

  // Check Database Connection
  try {
    const { data, error } = await supabase.from('users').select('count').single();
    results.database = {
      status: error ? 'error' : 'healthy',
      details: error ? error.message : 'Database connection successful',
      timestamp
    };
  } catch (error) {
    results.database = {
      status: 'error',
      details: error.message,
      timestamp
    };
  }

  // Check Authentication
  try {
    const { data: { session } } = await supabase.auth.getSession();
    results.authentication = {
      status: 'healthy',
      details: 'Authentication service operational',
      timestamp
    };
  } catch (error) {
    results.authentication = {
      status: 'error',
      details: error.message,
      timestamp
    };
  }

  // Check Email Service
  try {
    const emailTest = await emailService.sendEmail({
      to: 'test@example.com',
      template: {
        subject: 'Health Check',
        html: '<p>Test email</p>',
        text: 'Test email'
      }
    });
    results.email = {
      status: emailTest ? 'healthy' : 'error',
      details: emailTest ? 'Email service operational' : 'Email service failed',
      timestamp
    };
  } catch (error) {
    results.email = {
      status: 'error',
      details: error.message,
      timestamp
    };
  }

  // Check Payment Processing
  try {
    const stripe = await stripePromise;
    results.payments = {
      status: stripe ? 'healthy' : 'error',
      details: stripe ? 'Payment service operational' : 'Payment service unavailable',
      timestamp
    };
  } catch (error) {
    results.payments = {
      status: 'error',
      details: error.message,
      timestamp
    };
  }

  // Check Booking System
  try {
    const availability = await bookingService.checkAvailability(
      new Date().toISOString().split('T')[0],
      '10:00',
      '12345'
    );
    results.bookings = {
      status: 'healthy',
      details: 'Booking system operational',
      timestamp
    };
  } catch (error) {
    results.bookings = {
      status: 'error',
      details: error.message,
      timestamp
    };
  }

  // Check External Integrations
  try {
    const integrationResults = await testAllIntegrations();
    results.integrations = {
      status: integrationResults.overallStatus === 'healthy' ? 'healthy' : 'degraded',
      details: `${integrationResults.criticalIssues} critical issues, ${integrationResults.warnings} warnings`,
      timestamp
    };
  } catch (error) {
    results.integrations = {
      status: 'error',
      details: error.message,
      timestamp
    };
  }

  // Check Password Service
  try {
    const passwordCheck = await passwordService.validatePassword('Test123!@#');
    results.passwordService = {
      status: 'healthy',
      details: 'Password service operational',
      timestamp
    };
  } catch (error) {
    results.passwordService = {
      status: 'error',
      details: error.message,
      timestamp
    };
  }

  return results;
}

export function generateHealthReport(results: Record<string, HealthCheckResult>) {
  const criticalServices = ['database', 'authentication', 'payments'];
  const overallStatus = criticalServices.some(service => results[service]?.status === 'error')
    ? 'error'
    : Object.values(results).some(result => result.status === 'error')
    ? 'degraded'
    : 'healthy';

  return {
    timestamp: new Date().toISOString(),
    overallStatus,
    services: results,
    summary: {
      healthy: Object.values(results).filter(r => r.status === 'healthy').length,
      degraded: Object.values(results).filter(r => r.status === 'degraded').length,
      error: Object.values(results).filter(r => r.status === 'error').length
    },
    recommendations: generateRecommendations(results)
  };
}

function generateRecommendations(results: Record<string, HealthCheckResult>) {
  const recommendations = [];

  for (const [service, result] of Object.entries(results)) {
    if (result.status === 'error') {
      recommendations.push({
        service,
        priority: 'high',
        action: `Fix ${service} service: ${result.details}`,
        timestamp: result.timestamp
      });
    } else if (result.status === 'degraded') {
      recommendations.push({
        service,
        priority: 'medium',
        action: `Investigate ${service} degradation: ${result.details}`,
        timestamp: result.timestamp
      });
    }
  }

  return recommendations;
}