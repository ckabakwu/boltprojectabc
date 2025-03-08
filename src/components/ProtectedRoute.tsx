import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import LoadingSpinner from './ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'provider' | 'customer')[];
}

const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const { user, loading, isAdmin, isProvider, isCustomer } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If user is not logged in, redirect to login with return path
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Get user's role
  const userRole = isAdmin ? 'admin' : isProvider ? 'provider' : 'customer';

  // If user is logged in but trying to access auth pages (login/register/etc)
  if (['/login', '/register', '/forgot-password'].includes(location.pathname)) {
    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'provider':
        return <Navigate to="/pro-dashboard" replace />;
      case 'customer':
        return <Navigate to="/customer-dashboard" replace />;
    }
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'provider':
        return <Navigate to="/pro-dashboard" replace />;
      case 'customer':
        return <Navigate to="/customer-dashboard" replace />;
    }
  }

  // Check specific route restrictions
  if (location.pathname.startsWith('/admin') && !isAdmin) {
    // Non-admin users trying to access admin routes
    switch (userRole) {
      case 'provider':
        return <Navigate to="/pro-dashboard" replace />;
      case 'customer':
        return <Navigate to="/customer-dashboard" replace />;
    }
  }

  if (location.pathname.startsWith('/pro-dashboard') && !isProvider) {
    // Non-provider users trying to access provider routes
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'customer':
        return <Navigate to="/customer-dashboard" replace />;
    }
  }

  if (location.pathname.startsWith('/customer-dashboard') && !isCustomer) {
    // Non-customer users trying to access customer routes
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'provider':
        return <Navigate to="/pro-dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;