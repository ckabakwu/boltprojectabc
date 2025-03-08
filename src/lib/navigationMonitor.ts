import { visualizationMonitor } from './visualization';
import mixpanel from './analytics';
import { routeExists, validateBreadcrumbs, getParentRoute } from './routeValidation';

interface NavigationEvent {
  from: string;
  to: string;
  timestamp: string;
  userId?: string;
  success: boolean;
  error?: string;
}

class NavigationMonitor {
  private static instance: NavigationMonitor;
  private events: NavigationEvent[] = [];
  private readonly MAX_EVENTS = 1000;

  private constructor() {}

  public static getInstance(): NavigationMonitor {
    if (!NavigationMonitor.instance) {
      NavigationMonitor.instance = new NavigationMonitor();
    }
    return NavigationMonitor.instance;
  }

  public logNavigation(event: NavigationEvent) {
    // Validate destination route
    const isValidRoute = routeExists(event.to);
    const hasBreadcrumbs = validateBreadcrumbs(event.to);
    const parentRoute = getParentRoute(event.to);

    // Update event with validation results
    const validatedEvent: NavigationEvent = {
      ...event,
      success: event.success && isValidRoute && hasBreadcrumbs,
      error: !isValidRoute ? 'Invalid route' :
             !hasBreadcrumbs ? 'Invalid breadcrumb path' :
             event.error
    };

    // Add event to history
    this.events.unshift(validatedEvent);
    
    // Trim history if needed
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(0, this.MAX_EVENTS);
    }

    // Track in analytics
    mixpanel.track('Navigation', {
      from: validatedEvent.from,
      to: validatedEvent.to,
      success: validatedEvent.success,
      error: validatedEvent.error,
      timestamp: validatedEvent.timestamp,
      hasParentRoute: !!parentRoute,
      parentRoute
    });

    // Log visualization check
    visualizationMonitor.logCheck({
      component: 'Navigation',
      status: validatedEvent.success ? 'success' : 'error',
      message: validatedEvent.error,
      timestamp: new Date(validatedEvent.timestamp)
    });
  }

  public getNavigationHistory(): NavigationEvent[] {
    return this.events;
  }

  public getFailedNavigations(): NavigationEvent[] {
    return this.events.filter(event => !event.success);
  }

  public generateReport() {
    const total = this.events.length;
    const failed = this.getFailedNavigations().length;
    const success = total - failed;
    const successRate = total > 0 ? (success / total) * 100 : 100;

    return {
      summary: {
        total,
        success,
        failed,
        successRate
      },
      recentFailures: this.getFailedNavigations().slice(0, 10),
      routeAnalysis: {
        invalidRoutes: this.events
          .filter(e => e.error === 'Invalid route')
          .map(e => e.to),
        brokenBreadcrumbs: this.events
          .filter(e => e.error === 'Invalid breadcrumb path')
          .map(e => e.to),
        orphanedPages: this.events
          .filter(e => !getParentRoute(e.to))
          .map(e => e.to)
      },
      timestamp: new Date().toISOString()
    };
  }

  public clearHistory() {
    this.events = [];
  }
}

export const navigationMonitor = NavigationMonitor.getInstance();