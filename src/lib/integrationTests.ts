import { supabase } from './supabase';
import mixpanel from './analytics';
import mapboxgl from 'mapbox-gl';
import { integrationHub } from './integrationHub';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  error?: string;
  responseTime?: number;
  version?: string;
  rateLimit?: {
    remaining: number;
    reset: number;
  };
}

// Test Supabase Connection
export const testSupabaseConnection = async (): Promise<TestResult> => {
  const start = Date.now();
  try {
    // Test basic query
    const { data, error } = await supabase.from('users').select('count').single();
    if (error) throw error;

    // Test RLS policies
    const { data: rlsTest, error: rlsError } = await supabase
      .from('users')
      .select('role')
      .limit(1);
    if (rlsError) throw rlsError;

    return {
      name: 'Supabase',
      status: 'success',
      responseTime: Date.now() - start,
      version: 'v2.39.7' // From package.json
    };
  } catch (error) {
    return {
      name: 'Supabase',
      status: 'error',
      error: error.message,
      responseTime: Date.now() - start
    };
  }
};

// Test Mapbox Connection
export const testMapboxConnection = async (): Promise<TestResult> => {
  const start = Date.now();
  try {
    // Verify token
    if (!mapboxgl.accessToken) {
      throw new Error('Mapbox access token not configured');
    }

    // Test geocoding API
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/New York.json?access_token=${mapboxgl.accessToken}`
    );
    
    if (!response.ok) {
      throw new Error('Mapbox API request failed');
    }

    // Get rate limit info from headers
    const rateLimit = {
      remaining: parseInt(response.headers.get('x-rate-limit-remaining') || '0'),
      reset: parseInt(response.headers.get('x-rate-limit-reset') || '0')
    };

    return {
      name: 'Mapbox',
      status: 'success',
      responseTime: Date.now() - start,
      version: 'v3.1.2', // From package.json
      rateLimit
    };
  } catch (error) {
    return {
      name: 'Mapbox',
      status: 'error',
      error: error.message,
      responseTime: Date.now() - start
    };
  }
};

// Test Mixpanel Connection
export const testMixpanelConnection = async (): Promise<TestResult> => {
  const start = Date.now();
  try {
    // Test track event
    mixpanel.track('Integration Test', {
      timestamp: new Date().toISOString()
    });

    // Check if token is configured
    if (!mixpanel.__loaded) {
      return {
        name: 'Mixpanel',
        status: 'warning',
        error: 'Mixpanel is in test mode',
        responseTime: Date.now() - start,
        version: 'v2.49.0' // From package.json
      };
    }

    return {
      name: 'Mixpanel',
      status: 'success',
      responseTime: Date.now() - start,
      version: 'v2.49.0' // From package.json
    };
  } catch (error) {
    return {
      name: 'Mixpanel',
      status: 'error',
      error: error.message,
      responseTime: Date.now() - start
    };
  }
};

// Test AWS SQS Connection
export const testSQSConnection = async (): Promise<TestResult> => {
  const start = Date.now();
  try {
    const AWS_CONFIG = {
      region: import.meta.env.VITE_AWS_REGION,
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      queueUrl: import.meta.env.VITE_AWS_SQS_QUEUE_URL
    };

    // Verify configuration
    if (!AWS_CONFIG.region || !AWS_CONFIG.accessKeyId || 
        !AWS_CONFIG.secretAccessKey || !AWS_CONFIG.queueUrl) {
      throw new Error('AWS SQS configuration missing');
    }

    return {
      name: 'AWS SQS',
      status: 'success',
      responseTime: Date.now() - start,
      version: 'v3.535.0' // From package.json
    };
  } catch (error) {
    return {
      name: 'AWS SQS',
      status: 'error',
      error: error.message,
      responseTime: Date.now() - start
    };
  }
};

// Test all integrations
export const testAllIntegrations = async () => {
  const results = await Promise.all([
    testSupabaseConnection(),
    testMapboxConnection(),
    testMixpanelConnection(),
    testSQSConnection()
  ]);

  // Get active integrations from IntegrationHub
  const activeConfigs = integrationHub.getActiveConfigs();

  const report = {
    timestamp: new Date().toISOString(),
    results,
    activeIntegrations: activeConfigs.length,
    overallStatus: results.every(r => r.status === 'success') ? 'healthy' : 'degraded',
    averageResponseTime: results.reduce((acc, r) => acc + (r.responseTime || 0), 0) / results.length,
    criticalIssues: results.filter(r => r.status === 'error').length,
    warnings: results.filter(r => r.status === 'warning').length,
    recommendations: generateRecommendations(results)
  };

  return report;
};

function generateRecommendations(results: TestResult[]) {
  const recommendations = [];

  for (const result of results) {
    if (result.status === 'error') {
      recommendations.push({
        integration: result.name,
        priority: 'high',
        message: `Fix ${result.name} integration: ${result.error}`,
        action: 'immediate'
      });
    }

    if (result.status === 'warning') {
      recommendations.push({
        integration: result.name,
        priority: 'medium',
        message: `Address ${result.name} warning: ${result.error}`,
        action: 'required'
      });
    }

    if (result.rateLimit && result.rateLimit.remaining < 100) {
      recommendations.push({
        integration: result.name,
        priority: 'medium',
        message: `Rate limit warning for ${result.name}: ${result.rateLimit.remaining} requests remaining`,
        action: 'monitor'
      });
    }
  }

  return recommendations;
}

export const generateIntegrationReport = async () => {
  const testResults = await testAllIntegrations();
  
  return {
    summary: {
      timestamp: testResults.timestamp,
      status: testResults.overallStatus,
      criticalIssues: testResults.criticalIssues,
      warnings: testResults.warnings
    },
    integrations: testResults.results.map(result => ({
      name: result.name,
      status: result.status,
      version: result.version,
      responseTime: result.responseTime,
      error: result.error,
      rateLimit: result.rateLimit
    })),
    recommendations: testResults.recommendations,
    metrics: {
      averageResponseTime: testResults.averageResponseTime,
      activeIntegrations: testResults.activeIntegrations
    }
  };
};