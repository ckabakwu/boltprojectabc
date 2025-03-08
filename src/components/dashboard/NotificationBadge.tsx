import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

interface NotificationBadgeProps {
  count: number;
  onClick?: () => void;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, onClick }) => {
  return (
    <button
      className="relative p-2 text-gray-400 hover:text-gray-500"
      onClick={onClick}
    >
      <span className="sr-only">View notifications</span>
      <Bell className="h-6 w-6" />
      {count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full"
        >
          {count > 9 ? '9+' : count}
        </motion.span>
      )}
    </button>
  );
};

export default NotificationBadge;