import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Sparkles, 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  Home, 
  Calendar, 
  MessageSquare, 
  CreditCard
} from 'lucide-react';

interface DashboardHeaderProps {
  unreadNotifications?: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  unreadNotifications = 0 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/customer-dashboard" className="flex items-center space-x-2">
                <div className="bg-blue-600 rounded-full p-2">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-blue-600">HomeMaidy</span>
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center ml-4">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link to="/customer-dashboard" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Dashboard
            </Link>
            <Link to="/customer-dashboard/bookings" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              My Bookings
            </Link>
            <Link to="/customer-dashboard/payments" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Payments
            </Link>
            <Link to="/customer-dashboard/messages" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Messages
            </Link>
          </nav>
          
          {/* Right Side Icons */}
          <div className="flex items-center">
            {/* Notifications */}
            <div className="relative">
              <Link to="/customer-dashboard/notifications" className="p-2 text-gray-400 hover:text-gray-500 relative">
                <span className="sr-only">Notifications</span>
                <Bell className="h-6 w-6" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 inline-block w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </Link>
            </div>
            
            {/* Profile Dropdown */}
            <div className="ml-3 relative">
              <div>
                <button
                  type="button"
                  className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User className="h-5 w-5" />
                  </div>
                </button>
              </div>
              
              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">John Smith</p>
                    <p className="text-xs text-gray-500 truncate">john.smith@example.com</p>
                  </div>
                  <Link
                    to="/customer-dashboard/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-0"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <div className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </div>
                  </Link>
                  <Link
                    to="/logout"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-1"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <div className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </div>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Book Now Button */}
            <div className="ml-6 hidden md:block">
              <Link
                to="/booking"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Book Cleaning
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/customer-dashboard"
              className="block pl-3 pr-4 py-2 border-l-4 border-blue-500 text-base font-medium text-blue-700 bg-blue-50"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </div>
            </Link>
            <Link
              to="/customer-dashboard/bookings"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <Calendar className="mr-3 h-5 w-5" />
                My Bookings
              </div>
            </Link>
            <Link
              to="/customer-dashboard/payments"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <CreditCard className="mr-3 h-5 w-5" />
                Payments
              </div>
            </Link>
            <Link
              to="/customer-dashboard/messages"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <MessageSquare className="mr-3 h-5 w-5" />
                Messages
              </div>
            </Link>
            <Link
              to="/customer-dashboard/notifications"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <Bell className="mr-3 h-5 w-5" />
                Notifications
                {unreadNotifications > 0 && (
                  <span className="ml-2 inline-block w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </div>
            </Link>
            <Link
              to="/customer-dashboard/settings"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </div>
            </Link>
            <Link
              to="/logout"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <LogOut className="mr-3 h-5 w-5" />
                Sign out
              </div>
            </Link>
            <Link
              to="/booking"
              className="block text-center mx-3 mt-3 px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setIsOpen(false)}
            >
              Book Cleaning
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;