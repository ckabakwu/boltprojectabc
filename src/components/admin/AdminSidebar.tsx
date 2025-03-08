import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  Calendar,
  Users,
  DollarSign,
  BarChart2,
  MessageSquare,
  Star,
  Tag,
  Settings,
  Sliders,
  Bell,
  UserPlus,
  Briefcase,
  Users as UsersIcon,
  FileText,
  MapPin
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  return (
    <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 pt-16 bg-white border-r border-gray-200">
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {/* Dashboard */}
          <Link
            to="/admin/dashboard"
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive('/admin/dashboard')
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Home className={`mr-3 h-5 w-5 ${
              isActive('/admin/dashboard')
                ? 'text-blue-600'
                : 'text-gray-400 group-hover:text-gray-500'
            }`} />
            Dashboard
          </Link>

          {/* CRM Section */}
          <div className="space-y-1">
            <div className="px-3 pt-4 pb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                CRM
              </h3>
            </div>
            
            <Link
              to="/admin/crm/leads"
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive('/admin/crm/leads')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <UserPlus className={`mr-3 h-5 w-5 ${
                isActive('/admin/crm/leads')
                  ? 'text-blue-600'
                  : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              Leads Management
            </Link>

            <Link
              to="/admin/crm/incomplete-bookings"
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive('/admin/crm/incomplete-bookings')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <FileText className={`mr-3 h-5 w-5 ${
                isActive('/admin/crm/incomplete-bookings')
                  ? 'text-blue-600'
                  : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              Incomplete Bookings
            </Link>

            <Link
              to="/admin/crm/customers"
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive('/admin/crm/customers')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <UsersIcon className={`mr-3 h-5 w-5 ${
                isActive('/admin/crm/customers')
                  ? 'text-blue-600'
                  : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              Customer Overview
            </Link>
          </div>

          {/* Management Section */}
          <div className="space-y-1">
            <div className="px-3 pt-4 pb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Management
              </h3>
            </div>

            <Link
              to="/admin/bookings"
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive('/admin/bookings')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Calendar className={`mr-3 h-5 w-5 ${
                isActive('/admin/bookings')
                  ? 'text-blue-600'
                  : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              Bookings
            </Link>

            <Link
              to="/admin/users"
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive('/admin/users')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Users className={`mr-3 h-5 w-5 ${
                isActive('/admin/users')
                  ? 'text-blue-600'
                  : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              Users
            </Link>

            <Link
              to="/admin/service-areas"
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive('/admin/service-areas')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <MapPin className={`mr-3 h-5 w-5 ${
                isActive('/admin/service-areas')
                  ? 'text-blue-600'
                  : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              Service Areas
            </Link>

            <Link
              to="/admin/payments"
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive('/admin/payments')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <DollarSign className={`mr-3 h-5 w-5 ${
                isActive('/admin/payments')
                  ? 'text-blue-600'
                  : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              Payments
            </Link>

            <Link
              to="/admin/reports"
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive('/admin/reports')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <BarChart2 className={`mr-3 h-5 w-5 ${
                isActive('/admin/reports')
                  ? 'text-blue-600'
                  : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              Reports
            </Link>
          </div>

          {/* System Section */}
          <div className="space-y-1">
            <div className="px-3 pt-4 pb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                System
              </h3>
            </div>

            <Link
              to="/admin/reviews"
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive('/admin/reviews')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Star className={`mr-3 h-5 w-5 ${
                isActive('/admin/reviews')
                  ? 'text-blue-600'
                  : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              Reviews
            </Link>

            <Link
              to="/admin/promotions"
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive('/admin/promotions')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Tag className={`mr-3 h-5 w-5 ${
                isActive('/admin/promotions')
                  ? 'text-blue-600'
                  : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              Promotions
            </Link>

            <Link
              to="/admin/automations"
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive('/admin/automations')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Sliders className={`mr-3 h-5 w-5 ${
                isActive('/admin/automations')
                  ? 'text-blue-600'
                  : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              Automations
            </Link>

            <Link
              to="/admin/notifications"
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive('/admin/notifications')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Bell className={`mr-3 h-5 w-5 ${
                isActive('/admin/notifications')
                  ? 'text-blue-600'
                  : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              Notifications
            </Link>

            <Link
              to="/admin/settings"
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive('/admin/settings')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Settings className={`mr-3 h-5 w-5 ${
                isActive('/admin/settings')
                  ? 'text-blue-600'
                  : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              Settings
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;