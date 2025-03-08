import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardFooter from '../components/dashboard/DashboardFooter';

interface DashboardLayoutProps {
  unreadNotifications?: number;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  unreadNotifications = 3 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader unreadNotifications={unreadNotifications} />
      <DashboardSidebar unreadNotifications={unreadNotifications} />
      
      <div className="md:pl-64 flex flex-col">
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-16">
              <Outlet />
            </div>
          </div>
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
};

export default DashboardLayout;