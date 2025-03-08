import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronRight,
  ChevronLeft,
  Search,
  MapPin,
  Briefcase,
  FileText,
  Sliders,
  Bell,
  Shield,
  Command
} from 'lucide-react';
import Tooltip from '../ui/Tooltip';

interface NavigationItem {
  name: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  items?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard Overview',
    icon: <Home className="w-6 h-6" />,
    href: '/admin/dashboard'
  },
  {
    name: 'Bookings Management',
    icon: <Calendar className="w-6 h-6" />,
    href: '/admin/bookings',
    items: [
      { name: 'Active Bookings', icon: <Calendar />, href: '/admin/bookings/active' },
      { name: 'Booking Calendar', icon: <Calendar />, href: '/admin/bookings/calendar' },
      { name: 'Service Schedule', icon: <Calendar />, href: '/admin/bookings/schedule' },
      { name: 'Booking History', icon: <FileText />, href: '/admin/bookings/history' },
      { name: 'Dispute Resolution', icon: <MessageSquare />, href: '/admin/bookings/disputes' }
    ]
  },
  {
    name: 'Customer Portal',
    icon: <Users className="w-6 h-6" />,
    href: '/admin/customers',
    items: [
      { name: 'Customer Directory', icon: <Users />, href: '/admin/customers/directory' },
      { name: 'Profile Management', icon: <Users />, href: '/admin/customers/profiles' },
      { name: 'Communication Log', icon: <MessageSquare />, href: '/admin/customers/communications' },
      { name: 'Service History', icon: <FileText />, href: '/admin/customers/history' },
      { name: 'Payment Management', icon: <DollarSign />, href: '/admin/customers/payments' }
    ]
  },
  {
    name: 'CRM Tools',
    icon: <Briefcase className="w-6 h-6" />,
    href: '/admin/crm',
    items: [
      { name: 'Lead Management', icon: <Users />, href: '/admin/crm/leads' },
      { name: 'Customer Segmentation', icon: <Users />, href: '/admin/crm/segments' },
      { name: 'Campaign Builder', icon: <FileText />, href: '/admin/crm/campaigns' },
      { name: 'Communication Templates', icon: <MessageSquare />, href: '/admin/crm/templates' },
      { name: 'Follow-up Tasks', icon: <Calendar />, href: '/admin/crm/tasks' }
    ]
  },
  {
    name: 'Service Professional Hub',
    icon: <Users className="w-6 h-6" />,
    href: '/admin/pros',
    items: [
      { name: 'Provider Directory', icon: <Users />, href: '/admin/pros/directory' },
      { name: 'Onboarding Status', icon: <FileText />, href: '/admin/pros/onboarding' },
      { name: 'Performance Metrics', icon: <BarChart2 />, href: '/admin/pros/performance' },
      { name: 'Schedule Management', icon: <Calendar />, href: '/admin/pros/schedule' },
      { name: 'Training Resources', icon: <FileText />, href: '/admin/pros/training' },
      { name: 'Payments Management', icon: <DollarSign />, href: '/admin/pros/payments' }
    ]
  },
  {
    name: 'Geographic Coverage',
    icon: <MapPin className="w-6 h-6" />,
    href: '/admin/service-areas',
    items: [
      { name: 'Service Area Map', icon: <MapPin />, href: '/admin/service-areas/map' },
      { name: 'Zone Management', icon: <MapPin />, href: '/admin/service-areas/zones' },
      { name: 'Coverage Analysis', icon: <BarChart2 />, href: '/admin/service-areas/analysis' },
      { name: 'Expansion Planning', icon: <MapPin />, href: '/admin/service-areas/expansion' }
    ]
  },
  {
    name: 'Financial Center',
    icon: <DollarSign className="w-6 h-6" />,
    href: '/admin/finance',
    items: [
      { name: 'Transaction History', icon: <DollarSign />, href: '/admin/finance/transactions' },
      { name: 'Payment Processing', icon: <DollarSign />, href: '/admin/finance/payments' },
      { name: 'Refund Management', icon: <DollarSign />, href: '/admin/finance/refunds' },
      { name: 'Financial Reports', icon: <FileText />, href: '/admin/finance/reports' },
      { name: 'Tax Documentation', icon: <FileText />, href: '/admin/finance/tax' }
    ]
  },
  {
    name: 'Promotional Tools',
    icon: <Tag className="w-6 h-6" />,
    href: '/admin/promotions',
    items: [
      { name: 'Campaign Builder', icon: <Tag />, href: '/admin/promotions/campaigns' },
      { name: 'Discount Management', icon: <Tag />, href: '/admin/promotions/discounts' },
      { name: 'Loyalty Programs', icon: <Star />, href: '/admin/promotions/loyalty' },
      { name: 'Referral System', icon: <Users />, href: '/admin/promotions/referrals' },
      { name: 'Promotion Analytics', icon: <BarChart2 />, href: '/admin/promotions/analytics' }
    ]
  },
  {
    name: 'Analytics Dashboard',
    icon: <BarChart2 className="w-6 h-6" />,
    href: '/admin/analytics',
    items: [
      { name: 'Business Intelligence', icon: <BarChart2 />, href: '/admin/analytics/bi' },
      { name: 'Custom Reports', icon: <FileText />, href: '/admin/analytics/reports' },
      { name: 'Data Visualization', icon: <BarChart2 />, href: '/admin/analytics/visualization' },
      { name: 'Export Tools', icon: <FileText />, href: '/admin/analytics/export' },
      { name: 'Performance Metrics', icon: <BarChart2 />, href: '/admin/analytics/performance' }
    ]
  },
  {
    name: 'System Configuration',
    icon: <Settings className="w-6 h-6" />,
    href: '/admin/settings',
    items: [
      { name: 'User Permissions', icon: <Shield />, href: '/admin/settings/permissions' },
      { name: 'API Settings', icon: <Sliders />, href: '/admin/settings/api' },
      { name: 'Integration Management', icon: <Settings />, href: '/admin/settings/integrations' },
      { name: 'Security Controls', icon: <Shield />, href: '/admin/settings/security' },
      { name: 'Backup Systems', icon: <Settings />, href: '/admin/settings/backup' }
    ]
  },
  {
    name: 'Account Management',
    icon: <Users className="w-6 h-6" />,
    href: '/admin/account',
    items: [
      { name: 'Profile Settings', icon: <Users />, href: '/admin/account/profile' },
      { name: 'Team Management', icon: <Users />, href: '/admin/account/team' },
      { name: 'Notification Preferences', icon: <Bell />, href: '/admin/account/notifications' },
      { name: 'Billing Information', icon: <DollarSign />, href: '/admin/account/billing' },
      { name: 'Support Access', icon: <MessageSquare />, href: '/admin/account/support' }
    ]
  },
  {
    name: 'Workflow Automation',
    icon: <Sliders className="w-6 h-6" />,
    href: '/admin/automations',
    items: [
      { name: 'Rule Builder', icon: <Sliders />, href: '/admin/automations/rules' },
      { name: 'Trigger Management', icon: <Sliders />, href: '/admin/automations/triggers' },
      { name: 'Action Templates', icon: <FileText />, href: '/admin/automations/templates' },
      { name: 'Automation Logs', icon: <FileText />, href: '/admin/automations/logs' },
      { name: 'Performance Analytics', icon: <BarChart2 />, href: '/admin/automations/analytics' }
    ]
  }
];

const AdminNavigation = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  const filteredNavigation = navigation.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.items?.some(subItem => 
      subItem.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleKeyboardShortcut = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('nav-search')?.focus();
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyboardShortcut);
    return () => document.removeEventListener('keydown', handleKeyboardShortcut);
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 64 : 280 }}
      className="fixed inset-y-0 left-0 z-20 flex flex-col bg-white border-r border-gray-200 pt-16"
    >
      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            id="nav-search"
            type="text"
            placeholder="Search menu... ⌘K"
            className={`w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
              isCollapsed ? 'hidden' : ''
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto">
        <nav className="px-3 space-y-1">
          {filteredNavigation.map((item) => (
            <div key={item.href}>
              <Tooltip
                content={isCollapsed ? item.name : null}
                position="right"
              >
                <Link
                  to={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-lg
                    ${isActive(item.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  onClick={() => item.items && setActiveGroup(activeGroup === item.name ? null : item.name)}
                >
                  <div className="flex items-center">
                    {item.icon}
                    {!isCollapsed && (
                      <>
                        <span className="ml-3 flex-1">{item.name}</span>
                        {item.items && (
                          <ChevronRight
                            className={`ml-auto h-5 w-5 transform transition-transform ${
                              activeGroup === item.name ? 'rotate-90' : ''
                            }`}
                          />
                        )}
                        {item.badge && (
                          <span className="ml-auto inline-block py-0.5 px-2 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </Link>
              </Tooltip>

              {/* Submenu */}
              <AnimatePresence>
                {!isCollapsed && item.items && activeGroup === item.name && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-1 space-y-1"
                  >
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.href}
                        to={subItem.href}
                        className={`
                          group flex items-center pl-10 pr-2 py-2 text-sm font-medium rounded-lg
                          ${isActive(subItem.href)
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }
                        `}
                      >
                        {subItem.icon}
                        <span className="ml-3">{subItem.name}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
      </div>

      {/* Collapse Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 mr-2" />
              <span className="text-sm">Collapse Menu</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default AdminNavigation;