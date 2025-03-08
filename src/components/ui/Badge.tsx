import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  dot = false,
  removable = false,
  onRemove
}) => {
  const variants = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-indigo-100 text-indigo-800'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };

  return (
    <motion.span
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        inline-flex items-center font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`h-2 w-2 rounded-full mr-1.5 bg-current`} />
      )}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className={`
            ml-1.5 -mr-1 h-4 w-4 rounded-full inline-flex items-center justify-center
            hover:bg-${variant}-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${variant}-500
          `}
        >
          <span className="sr-only">Remove</span>
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      )}
    </motion.span>
  );
};

export default Badge;