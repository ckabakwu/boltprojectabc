import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import LoadingSpinner from '../ui/LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  allowedRoles = [],
  requireAuth = true
}) => {
  const { user, loading, isAdmin, isProvider, isCustomer } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If auth is required and user is not logged in
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is logged in but trying to access auth pages
  if (user && ['/login', '/register', '/forgot-password'].includes(location.pathname)) {
    const redirectPath = isAdmin ? '/admin/dashboard' :
                        isProvider ? '/pro-dashboard' :
                        isCustomer ? '/customer-dashboard' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  // Check role-based access
  if (allowedRoles.length > 0) {
    const userRole = isAdmin ? 'admin' : isProvider ? 'provider' : 'customer';
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default AuthGuard;