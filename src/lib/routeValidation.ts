// Define valid routes and their requirements
const routes = {
  // Public routes
  '/': { auth: false },
  '/login': { auth: false },
  '/register': { auth: false },
  '/forgot-password': { auth: false },
  '/reset-password': { auth: false },
  '/pro-signup': { auth: false },
  '/pro-application': { auth: false },
  '/services': { auth: false },
  '/about': { auth: false },
  '/contact': { auth: false },
  '/privacy': { auth: false },
  '/terms': { auth: false },
  '/service-areas': { auth: false },
  '/careers': { auth: false },
  '/blog': { auth: false },
  '/faq': { auth: false },
  '/booking': { auth: false },

  // Customer routes
  '/customer-dashboard': { auth: true, roles: ['customer'] },
  '/customer-dashboard/bookings': { auth: true, roles: ['customer'] },
  '/customer-dashboard/notifications': { auth: true, roles: ['customer'] },
  '/customer-dashboard/payments': { auth: true, roles: ['customer'] },
  '/customer-dashboard/messages': { auth: true, roles: ['customer'] },
  '/customer-dashboard/settings': { auth: true, roles: ['customer'] },

  // Pro routes
  '/pro-dashboard': { auth: true, roles: ['provider'] },
  '/pro/availability': { auth: true, roles: ['provider'] },
  '/pro/earnings': { auth: true, roles: ['provider'] },
  '/pro/messages': { auth: true, roles: ['provider'] },
  '/pro/settings': { auth: true, roles: ['provider'] },

  // Admin routes
  '/admin/login': { auth: false },
  '/admin/dashboard': { auth: true, roles: ['admin'] },
  '/admin/bookings': { auth: true, roles: ['admin'] },
  '/admin/users': { auth: true, roles: ['admin'] },
  '/admin/payments': { auth: true, roles: ['admin'] },
  '/admin/reports': { auth: true, roles: ['admin'] },
  '/admin/reviews': { auth: true, roles: ['admin'] },
  '/admin/promotions': { auth: true, roles: ['admin'] },
  '/admin/automations': { auth: true, roles: ['admin'] },
  '/admin/crm/leads': { auth: true, roles: ['admin'] },
  '/admin/crm/incomplete-bookings': { auth: true, roles: ['admin'] },
  '/admin/crm/customers': { auth: true, roles: ['admin'] },
  '/admin/settings': { auth: true, roles: ['admin'] }
};

// Validate route access
export const validateRoute = (pathname: string, isAuthenticated: boolean, userRole?: string) => {
  // Find matching route
  const route = Object.entries(routes).find(([path]) => {
    // Exact match
    if (path === pathname) return true;
    
    // Match route with params (e.g. /bookings/:id)
    const pathParts = path.split('/');
    const pathnameParts = pathname.split('/');
    
    if (pathParts.length !== pathnameParts.length) return false;
    
    return pathParts.every((part, i) => {
      if (part.startsWith(':')) return true;
      return part === pathnameParts[i];
    });
  });

  if (!route) {
    return { isValid: false, error: 'Route not found' };
  }

  const [_, requirements] = route;

  // Check authentication requirement
  if (requirements.auth && !isAuthenticated) {
    return { isValid: false, error: 'Authentication required' };
  }

  // Check role requirement
  if (requirements.roles && (!userRole || !requirements.roles.includes(userRole))) {
    return { isValid: false, error: 'Unauthorized role' };
  }

  return { isValid: true };
};

// Get redirect path for invalid routes
export const getRedirectPath = (pathname: string, isAuthenticated: boolean, userRole?: string) => {
  const { isValid, error } = validateRoute(pathname, isAuthenticated, userRole);

  if (!isValid) {
    if (error === 'Authentication required') {
      // Redirect to appropriate login page
      if (pathname.startsWith('/admin')) {
        return '/admin/login';
      }
      if (pathname.startsWith('/pro')) {
        return '/pro-signup';
      }
      return '/login';
    }

    if (error === 'Unauthorized role') {
      // Redirect to appropriate dashboard
      switch (userRole) {
        case 'admin':
          return '/admin/dashboard';
        case 'provider':
          return '/pro-dashboard';
        case 'customer':
          return '/customer-dashboard';
        default:
          return '/';
      }
    }

    // Route not found - redirect to 404
    return '/404';
  }

  return pathname;
};

// Validate breadcrumb navigation
export const validateBreadcrumbs = (pathname: string): boolean => {
  const pathParts = pathname.split('/').filter(Boolean);
  
  // Check each level of the path exists
  return pathParts.every((_, index) => {
    const partialPath = '/' + pathParts.slice(0, index + 1).join('/');
    return Object.keys(routes).includes(partialPath);
  });
};

// Get parent route
export const getParentRoute = (pathname: string): string => {
  const pathParts = pathname.split('/').filter(Boolean);
  if (pathParts.length <= 1) return '/';
  return '/' + pathParts.slice(0, -1).join('/');
};

// Check if route exists
export const routeExists = (pathname: string): boolean => {
  return Object.keys(routes).includes(pathname);
};

// Get all valid child routes
export const getChildRoutes = (pathname: string): string[] => {
  return Object.keys(routes).filter(route => 
    route.startsWith(pathname) && 
    route !== pathname &&
    route.split('/').length === pathname.split('/').length + 1
  );
};