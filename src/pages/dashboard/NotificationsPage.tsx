import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  CheckCircle, 
  User, 
  CreditCard, 
  AlertCircle, 
  Star, 
  Calendar,
  Check,
  Trash2,
  Filter
} from 'lucide-react';

// Mock data for notifications
const allNotifications = [
  {
    id: 1,
    type: 'booking_confirmation',
    title: 'Booking Confirmed',
    message: 'Your cleaning on June 15 at 10:00 AM has been confirmed.',
    date: '2025-06-10T14:30:00',
    read: false
  },
  {
    id: 2,
    type: 'cleaner_assigned',
    title: 'Cleaner Assigned',
    message: 'Maria Rodriguez has been assigned to your upcoming cleaning.',
    date: '2025-06-10T14:35:00',
    read: false
  },
  {
    id: 3,
    type: 'payment_processed',
    title: 'Payment Processed',
    message: 'Your payment of $120 for the upcoming cleaning has been processed.',
    date: '2025-06-10T14:40:00',
    read: false
  },
  {
    id: 4,
    type: 'reminder',
    title: 'Upcoming Cleaning Reminder',
    message: 'Your cleaning is scheduled for tomorrow at 10:00 AM. Please ensure access to your home.',
    date: '2025-06-14T09:00:00',
    read: true
  },
  {
    id: 5,
    type: 'rating_request',
    title: 'Rate Your Cleaning',
    message: 'How was your cleaning on May 15? Please take a moment to rate your experience.',
    date: '2025-05-15T16:00:00',
    read: true
  },
  {
    id: 6,
    type: 'promotion',
    title: 'Summer Cleaning Special',
    message: 'Book 3 cleanings and get 20% off your next booking. Use code SUMMER20 at checkout.',
    date: '2025-06-01T10:00:00',
    read: true
  },
  {
    id: 7,
    type: 'system',
    title: 'Profile Updated',
    message: 'Your profile information has been successfully updated.',
    date: '2025-05-20T11:30:00',
    read: true
  },
  {
    id: 8,
    type: 'booking_change',
    title: 'Booking Rescheduled',
    message: 'Your cleaning has been rescheduled to June 16 at 2:00 PM as requested.',
    date: '2025-06-05T15:45:00',
    read: true
  }
];

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState(allNotifications);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      }
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.read;
    return notification.type === activeFilter;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_confirmation':
      case 'booking_change':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'cleaner_assigned':
        return <User className="h-6 w-6 text-blue-600" />;
      case 'payment_processed':
        return <CreditCard className="h-6 w-6 text-purple-600" />;
      case 'reminder':
        return <AlertCircle className="h-6 w-6 text-yellow-600" />;
      case 'rating_request':
        return <Star className="h-6 w-6 text-blue-600" />;
      case 'promotion':
        return <Bell className="h-6 w-6 text-red-600" />;
      case 'system':
        return <Bell className="h-6 w-6 text-gray-600" />;
      default:
        return <Bell className="h-6 w-6 text-blue-600" />;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="mt-1 text-sm text-gray-500">
          Stay updated with important information about your bookings and account.
        </p>
      </div>
      
      {/* Notification Controls */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <span className="mr-2 text-sm text-gray-500">Filter:</span>
          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter className="h-4 w-4 mr-2 text-gray-400" />
              {activeFilter === 'all' ? 'All Notifications' : 
               activeFilter === 'unread' ? 'Unread' : 
               activeFilter.replace('_', ' ').charAt(0).toUpperCase() + activeFilter.replace('_', ' ').slice(1)}
            </button>
            
            {filterOpen && (
              <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1">
                  <button
                    className={`${
                      activeFilter === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } flex items-center px-4 py-2 text-sm w-full text-left hover:bg-gray-100`}
                    onClick={() => {
                      setActiveFilter('all');
                      setFilterOpen(false);
                    }}
                  >
                    All Notifications
                  </button>
                  <button
                    className={`${
                      activeFilter === 'unread' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } flex items-center px-4 py-2 text-sm w-full text-left hover:bg-gray-100`}
                    onClick={() => {
                      setActiveFilter('unread');
                      setFilterOpen(false);
                    }}
                  >
                    Unread
                    {unreadCount > 0 && (
                      <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-blue-100 text-blue-800">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <button
                    className={`${
                      activeFilter === 'booking_confirmation' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } flex items-center px-4 py-2 text-sm w-full text-left hover:bg-gray-100`}
                    onClick={() => {
                      setActiveFilter('booking_confirmation');
                      setFilterOpen(false);
                    }}
                  >
                    Booking Confirmations
                  </button>
                  <button
                    className={`${
                      activeFilter === 'payment_processed' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } flex items-center px-4 py-2 text-sm w-full text-left hover:bg-gray-100`}
                    onClick={() => {
                      setActiveFilter('payment_processed');
                      setFilterOpen(false);
                    }}
                  >
                    Payments
                  </button>
                  <button
                    className={`${
                      activeFilter === 'promotion' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } flex items-center px-4 py-2 text-sm w-full text-left hover:bg-gray-100`}
                    onClick={() => {
                      setActiveFilter('promotion');
                      setFilterOpen(false);
                    }}
                  >
                    Promotions
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-3">
          {unreadCount > 0 && (
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={markAllAsRead}
            >
              <Check className="h-4 w-4 mr-2 text-gray-400" />
              Mark all as read
            </button>
          )}
          
          {notifications.length > 0 && (
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={clearAllNotifications}
            >
              <Trash2 className="h-4 w-4 mr-2 text-gray-400" />
              Clear all
            </button>
          )}
        </div>
      </div>
      
      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <motion.li
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-6 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatNotificationDate(notification.date)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {notification.message}
                    </p>
                    
                    {notification.type === 'rating_request' && (
                      <div className="mt-3">
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              className="p-1 rounded-full hover:bg-gray-200"
                            >
                              <Star className={`h-5 w-5 text-gray-300 hover:text-yellow-400`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-3 flex-shrink-0 flex">
                    {!notification.read && (
                      <button
                        type="button"
                        className="mr-2 text-blue-600 hover:text-blue-800"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow rounded-lg p-6 text-center"
        >
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have any notifications at the moment.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default NotificationsPage;