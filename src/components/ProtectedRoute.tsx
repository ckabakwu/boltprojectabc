import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import LoadingSpinner from './ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'provider' | 'customer')[];
}

const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!user) {
    // Redirect admin routes to admin login, others to main login
    const loginPath = location.pathname.startsWith('/admin') ? '/admin/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location.pathname }} replace />;
  }

  // Check role-based access
  if (allowedRoles.length > 0) {
    const userRole = user.role;
    if (!allowedRoles.includes(userRole)) {
      // Redirect based on user's role
      if (userRole === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      } else if (userRole === 'provider') {
        return <Navigate to="/pro-dashboard" replace />;
      } else {
        return <Navigate to="/customer-dashboard" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;