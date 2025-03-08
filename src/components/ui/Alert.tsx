import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  showIcon?: boolean;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  showIcon = true,
  className = ''
}) => {
  const styles = {
    success: {
      bg: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-200',
      icon: <CheckCircle className="h-5 w-5 text-green-400" />
    },
    error: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200',
      icon: <AlertCircle className="h-5 w-5 text-red-400" />
    },
    warning: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      icon: <AlertCircle className="h-5 w-5 text-yellow-400" />
    },
    info: {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      icon: <Info className="h-5 w-5 text-blue-400" />
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`rounded-lg p-4 border ${styles[type].bg} ${styles[type].border} ${className}`}
      role="alert"
    >
      <div className="flex">
        {showIcon && (
          <div className="flex-shrink-0">
            {styles[type].icon}
          </div>
        )}
        <div className={`${showIcon ? 'ml-3' : ''} flex-1 ${styles[type].text}`}>
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          <div className={`text-sm ${title ? 'mt-2' : ''}`}>
            {message}
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              className={`inline-flex rounded-md p-1.5 ${styles[type].text} hover:${styles[type].bg} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${styles[type].bg} focus:ring-${type === 'info' ? 'blue' : type}-500`}
              onClick={onClose}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Alert;