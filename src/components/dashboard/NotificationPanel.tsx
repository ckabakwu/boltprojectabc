import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Calendar, 
  MessageSquare, 
  DollarSign, 
  Star, 
  CheckCircle,
  X,
  Settings,
  ChevronRight
} from 'lucide-react';

interface Notification {
  id: number;
  type: 'booking' | 'message' | 'payment' | 'review' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationPanelProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-5 w-5 text-blue-600" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-green-600" />;
      case 'payment':
        return <DollarSign className="h-5 w-5 text-purple-600" />;
      case 'review':
        return <Star className="h-5 w-5 text-yellow-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' || !notification.read
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-25 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Notifications</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-2">
                  <button
                    className={`px-3 py-1 rounded-full text-sm ${
                      filter === 'all'
                        ? 'bg-blue-100 text-blue-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setFilter('all')}
                  >
                    All
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full text-sm ${
                      filter === 'unread'
                        ? 'bg-blue-100 text-blue-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setFilter('unread')}
                  >
                    Unread
                  </button>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mark all as read
                  </button>
                  <button
                    onClick={onClearAll}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto h-[calc(100vh-120px)]">
              {filteredNotifications.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 hover:bg-gray-50 cursor-pointer ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          {notification.actionUrl && (
                            <a
                              href={notification.actionUrl}
                              className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                            >
                              View details
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </a>
                          )}
                        </div>
                        {!notification.read && (
                          <div className="ml-3">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <Bell className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No notifications
                  </h3>
                  <p className="text-gray-500">
                    You're all caught up! Check back later for new notifications.
                  </p>
                </div>
              )}
            </div>

            {/* Settings Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
              <button
                className="flex items-center justify-center w-full text-sm text-gray-600 hover:text-gray-800"
              >
                <Settings className="h-4 w-4 mr-2" />
                Notification Settings
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;