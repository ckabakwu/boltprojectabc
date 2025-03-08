import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  loading?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
  header,
  footer,
  loading = false
}) => {
  const cardContent = (
    <>
      {header && (
        <div className="px-6 py-4 border-b border-gray-200">
          {header}
        </div>
      )}
      <div className="p-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ) : (
          children
        )}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      )}
    </>
  );

  if (onClick) {
    return (
      <motion.button
        whileHover={hover ? { scale: 1.02 } : {}}
        whileTap={hover ? { scale: 0.98 } : {}}
        onClick={onClick}
        className={`w-full text-left bg-white rounded-xl shadow-sm overflow-hidden transition-shadow ${
          hover ? 'hover:shadow-md' : ''
        } ${className}`}
      >
        {cardContent}
      </motion.button>
    );
  }

  return (
    <motion.div
      whileHover={hover ? { scale: 1.02 } : {}}
      className={`bg-white rounded-xl shadow-sm overflow-hidden ${
        hover ? 'hover:shadow-md' : ''
      } ${className}`}
    >
      {cardContent}
    </motion.div>
  );
};

export default Card;