import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Bell, 
  CreditCard, 
  MessageSquare, 
  Settings, 
  LogOut,
  User,
  Star,
  Clock,
  Shield
} from 'lucide-react';

interface DashboardSidebarProps {
  unreadNotifications?: number;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  unreadNotifications = 0 
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  return (
    <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 pt-16 bg-white border-r border-gray-200">
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* User Profile Summary */}
        <div className="flex-shrink-0 px-4 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <User className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">John Smith</p>
              <p className="text-xs text-gray-500 truncate">john.smith@example.com</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          <Link
            to="/customer-dashboard"
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive('/customer-dashboard') && currentPath === '/customer-dashboard'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Home className={`mr-3 h-5 w-5 ${
              isActive('/customer-dashboard') && currentPath === '/customer-dashboard'
                ? 'text-blue-600'
                : 'text-gray-400 group-hover:text-gray-500'
            }`} />
            Dashboard
          </Link>
          
          <Link
            to="/customer-dashboard/bookings"
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive('/customer-dashboard/bookings')
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Calendar className={`mr-3 h-5 w-5 ${
              isActive('/customer-dashboard/bookings')
                ? 'text-blue-600'
                : 'text-gray-400 group-hover:text-gray-500'
            }`} />
            My Bookings
          </Link>
          
          <Link
            to="/customer-dashboard/notifications"
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive('/customer-dashboard/notifications')
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="relative mr-3">
              <Bell className={`h-5 w-5 ${
                isActive('/customer-dashboard/notifications')
                  ? 'text-blue-600'
                  : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 inline-block w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </div>
            Notifications
          </Link>
          
          <Link
            to="/customer-dashboard/payments"
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive('/customer-dashboard/payments')
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <CreditCard className={`mr-3 h-5 w-5 ${
              isActive('/customer-dashboard/payments')
                ? 'text-blue-600'
                : 'text-gray-400 group-hover:text-gray-500'
            }`} />
            Payments
          </Link>
          
          <Link
            to="/customer-dashboard/messages"
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive('/customer-dashboard/messages')
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <MessageSquare className={`mr-3 h-5 w-5 ${
              isActive('/customer-dashboard/messages')
                ? 'text-blue-600'
                : 'text-gray-400 group-hover:text-gray-500'
            }`} />
            Messages
          </Link>
          
          <Link
            to="/customer-dashboard/settings"
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive('/customer-dashboard/settings')
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Settings className={`mr-3 h-5 w-5 ${
              isActive('/customer-dashboard/settings')
                ? 'text-blue-600'
                : 'text-gray-400 group-hover:text-gray-500'
            }`} />
            Settings
          </Link>
        </nav>
        
        {/* Quick Stats */}
        <div className="px-4 py-4 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Quick Stats
          </h3>
          <div className="mt-3 space-y-3">
            <div className="flex items-center text-sm">
              <Star className="mr-2 h-4 w-4 text-yellow-400" />
              <span className="text-gray-600">4.9 Average Rating</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-green-500" />
              <span className="text-gray-600">12 Completed Cleanings</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4 text-blue-500" />
              <span className="text-gray-600">Next: Jun 15, 10:00 AM</span>
            </div>
            <div className="flex items-center text-sm">
              <Shield className="mr-2 h-4 w-4 text-purple-500" />
              <span className="text-gray-600">Premium Member</span>
            </div>
          </div>
        </div>
        
        {/* Book Now Button */}
        <div className="px-4 py-4 border-t border-gray-200">
          <Link
            to="/booking"
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Book New Cleaning
          </Link>
        </div>
        
        {/* Logout */}
        <div className="px-4 py-4 border-t border-gray-200">
          <Link
            to="/logout"
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
          >
            <LogOut className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" />
            Sign out
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;