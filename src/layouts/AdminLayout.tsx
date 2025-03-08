import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminHeader from '../components/admin/AdminHeader';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminBreadcrumbs from '../components/admin/AdminBreadcrumbs';
import { navigationMonitor } from '../lib/navigationMonitor';
import { routeMonitor } from '../lib/routeMonitor';
import { useAuth } from '../lib/auth';

const AdminLayout = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Log navigation event
    navigationMonitor.logNavigation({
      from: location.state?.from || '',
      to: location.pathname,
      timestamp: new Date().toISOString(),
      userId: user?.id,
      success: true
    });

    // Check route validity
    const routeCheck = routeMonitor.checkRoute(location.pathname);
    if (!routeCheck.exists || !routeCheck.hasComponent || !routeCheck.isAccessible) {
      navigationMonitor.logNavigation({
        from: location.state?.from || '',
        to: location.pathname,
        timestamp: new Date().toISOString(),
        userId: user?.id,
        success: false,
        error: 'Invalid route or missing component'
      });
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <AdminSidebar />
      
      <div className="md:pl-64 flex flex-col">
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-16">
              <div className="mb-6">
                <AdminBreadcrumbs />
              </div>
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;