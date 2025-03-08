import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Shield,
  User,
  Search,
  Menu,
  X,
  Settings,
  LogOut,
  HelpCircle,
  Command
} from 'lucide-react';
import { useAuth } from '../../lib/auth';

const AdminHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, signOut } = useAuth();
  const unreadNotifications = 3;

  const handleKeyPress = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsSearchOpen(true);
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <header className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/admin/dashboard" className="flex items-center space-x-2">
                <div className="bg-blue-600 rounded-full p-2">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-blue-600">Admin</span>
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
          
          {/* Search Bar */}
          <div className="hidden md:flex-1 md:flex md:items-center md:justify-center px-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full max-w-lg h-10 flex items-center text-sm leading-6 text-gray-400 rounded-lg ring-1 ring-gray-900/10 shadow-sm py-1.5 pl-2 pr-3 hover:ring-gray-300 bg-white"
            >
              <Search className="h-5 w-5 flex-none text-gray-400 mr-2" />
              <span className="flex-auto">Quick search...</span>
              <kbd className="ml-auto flex items-center text-[0.75rem] font-medium text-gray-400">
                <Command className="h-4 w-4 mr-1" />
                K
              </kbd>
            </button>
          </div>
          
          {/* Right Side Icons */}
          <div className="flex items-center">
            {/* Help */}
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Help</span>
              <HelpCircle className="h-6 w-6" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 inline-block w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </button>
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
                    <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/admin/settings"
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
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-1"
                    onClick={() => {
                      setIsProfileOpen(false);
                      signOut();
                    }}
                  >
                    <div className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {/* Mobile Search */}
            <div className="px-4 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;