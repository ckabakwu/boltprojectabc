import { navigationMonitor } from './navigationMonitor';
import { routeExists, validateBreadcrumbs, getParentRoute } from './routeValidation';

interface RouteCheck {
  path: string;
  exists: boolean;
  hasComponent: boolean;
  isAccessible: boolean;
  breadcrumbValid: boolean;
  parentRoute?: string;
}

class RouteMonitor {
  private static instance: RouteMonitor;
  private routes: Map<string, RouteCheck> = new Map();

  private constructor() {}

  public static getInstance(): RouteMonitor {
    if (!RouteMonitor.instance) {
      RouteMonitor.instance = new RouteMonitor();
    }
    return RouteMonitor.instance;
  }

  public checkRoute(path: string): RouteCheck {
    // Check if route exists
    const exists = routeExists(path);
    
    // Check if component exists
    const hasComponent = this.validateRouteComponent(path);
    
    // Check accessibility
    const isAccessible = this.validateRouteAccess(path);
    
    // Check breadcrumb
    const breadcrumbValid = validateBreadcrumbs(path);

    // Get parent route
    const parentRoute = getParentRoute(path);

    const check = { 
      path, 
      exists, 
      hasComponent, 
      isAccessible, 
      breadcrumbValid,
      parentRoute
    };

    this.routes.set(path, check);
    return check;
  }

  private validateRouteComponent(path: string): boolean {
    try {
      // Check if component file exists
      const componentName = path.split('/')
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('') + 'Page';

      // Dynamic import to check component existence
      import(`../pages/${componentName}`);
      return true;
    } catch {
      return false;
    }
  }

  private validateRouteAccess(path: string): boolean {
    // Check if route requires authentication
    const isProtectedRoute = path.startsWith('/admin') || 
                           path.startsWith('/pro-dashboard') ||
                           path.startsWith('/customer-dashboard');

    if (!isProtectedRoute) {
      return true;
    }

    // Check if user has required role
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
      return false;
    }

    if (path.startsWith('/admin') && userRole !== 'admin') {
      return false;
    }

    if (path.startsWith('/pro-dashboard') && userRole !== 'provider') {
      return false;
    }

    if (path.startsWith('/customer-dashboard') && userRole !== 'customer') {
      return false;
    }

    return true;
  }

  public getRouteStatus(path: string): RouteCheck | undefined {
    return this.routes.get(path);
  }

  public getAllRoutes(): RouteCheck[] {
    return Array.from(this.routes.values());
  }

  public getInvalidRoutes(): RouteCheck[] {
    return Array.from(this.routes.values()).filter(route => 
      !route.exists || 
      !route.hasComponent || 
      !route.isAccessible || 
      !route.breadcrumbValid
    );
  }

  public generateReport() {
    const routes = this.getAllRoutes();
    const invalidRoutes = this.getInvalidRoutes();

    return {
      timestamp: new Date().toISOString(),
      totalRoutes: routes.length,
      validRoutes: routes.length - invalidRoutes.length,
      invalidRoutes: invalidRoutes.length,
      issues: {
        missingComponents: invalidRoutes.filter(r => !r.hasComponent).length,
        inaccessible: invalidRoutes.filter(r => !r.isAccessible).length,
        invalidBreadcrumbs: invalidRoutes.filter(r => !r.breadcrumbValid).length,
        orphanedPages: invalidRoutes.filter(r => !r.parentRoute).length
      },
      details: invalidRoutes.map(route => ({
        path: route.path,
        issues: {
          missingComponent: !route.hasComponent,
          inaccessible: !route.isAccessible,
          invalidBreadcrumb: !route.breadcrumbValid,
          orphaned: !route.parentRoute
        }
      }))
    };
  }
}

export const routeMonitor = RouteMonitor.getInstance();