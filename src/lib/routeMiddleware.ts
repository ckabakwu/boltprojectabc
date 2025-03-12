import { NavigateFunction } from 'react-router-dom';
import { sessionService } from './sessionService';

export const routeGuard = (
  path: string,
  navigate: NavigateFunction
): boolean => {
  const userRole = sessionService.getUserRole();
  const isAuthenticated = sessionService.isSessionValid();

  // Public routes
  const publicRoutes = ['/', '/login', '/register', '/forgot-password'];
  if (publicRoutes.includes(path)) return true;

  // Authentication check
  if (!isAuthenticated) {
    navigate('/login', { state: { from: path } });
    return false;
  }

  // Role-based access
  const roleRoutes = {
    admin: ['/admin', '/admin/dashboard'],
    provider: ['/pro-dashboard', '/pro/availability'],
    customer: ['/customer-dashboard', '/bookings']
  };

  const allowedRoutes = roleRoutes[userRole as keyof typeof roleRoutes] || [];
  if (!allowedRoutes.some(route => path.startsWith(route))) {
    navigate('/unauthorized');
    return false;
  }

  return true;
};