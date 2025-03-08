import { visualizationMonitor, checkVisualization } from './visualization';

export const checkDashboardComponents = async () => {
  const components = [
    'AnalyticsWidget',
    'BookingForm',
    'ChatWidget',
    'DashboardStats',
    'EarningsChart',
    'JobStatusButton',
    'LeadPipeline',
    'MessageCenter',
    'NotificationBadge',
    'NotificationPanel',
    'PaymentWidget',
    'ProOnboardingFlow',
    'ReviewsWidget',
    'ScheduleCalendar',
    'ServiceAreaMap'
  ];

  const results = await Promise.all(
    components.map(async (component) => {
      const success = await checkVisualization(component, async () => {
        try {
          // Verify component can be imported
          await import(`../components/dashboard/${component}`);
          return true;
        } catch (error) {
          console.error(`Failed to load ${component}:`, error);
          return false;
        }
      });
      return { component, success };
    })
  );

  return results;
};

export const checkDashboardRoutes = async () => {
  const routes = [
    '/admin/dashboard',
    '/admin/bookings',
    '/admin/users',
    '/admin/payments',
    '/admin/reports',
    '/admin/reviews',
    '/admin/promotions',
    '/admin/automations',
    '/customer-dashboard',
    '/pro-dashboard',
    '/pro/availability',
    '/pro/earnings',
    '/pro/messages',
    '/pro/settings'
  ];

  const results = await Promise.all(
    routes.map(async (route) => {
      try {
        const response = await fetch(route);
        return {
          route,
          success: response.ok,
          status: response.status
        };
      } catch (error) {
        return {
          route,
          success: false,
          error: error.message
        };
      }
    })
  );

  return results;
};

export const checkDashboardAPIs = async () => {
  const endpoints = [
    '/api/bookings',
    '/api/users',
    '/api/payments',
    '/api/notifications',
    '/api/messages',
    '/api/reviews',
    '/api/analytics'
  ];

  const results = await Promise.all(
    endpoints.map(async (endpoint) => {
      try {
        const response = await fetch(endpoint);
        return {
          endpoint,
          success: response.ok,
          status: response.status
        };
      } catch (error) {
        return {
          endpoint,
          success: false,
          error: error.message
        };
      }
    })
  );

  return results;
};

export const generateDashboardReport = async () => {
  const componentResults = await checkDashboardComponents();
  const routeResults = await checkDashboardRoutes();
  const apiResults = await checkDashboardAPIs();

  return {
    timestamp: new Date(),
    components: componentResults,
    routes: routeResults,
    apis: apiResults,
    visualizationErrors: visualizationMonitor.getRecentErrors(),
    healthReport: visualizationMonitor.generateReport()
  };
};