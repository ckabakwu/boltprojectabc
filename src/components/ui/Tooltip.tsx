import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  let timeout: NodeJS.Timeout;

  const showTooltip = () => {
    timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeout);
    setIsVisible(false);
  };

  const positions = {
    top: '-translate-x-1/2 -translate-y-full left-1/2 bottom-[calc(100%+8px)]',
    bottom: '-translate-x-1/2 translate-y-2 left-1/2 top-full',
    left: '-translate-x-full -translate-y-1/2 right-[calc(100%+8px)] top-1/2',
    right: 'translate-x-2 -translate-y-1/2 left-full top-1/2'
  };

  const arrows = {
    top: 'bottom-[-6px] left-1/2 -translate-x-1/2 border-t-gray-700 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'top-[-6px] left-1/2 -translate-x-1/2 border-b-gray-700 border-l-transparent border-r-transparent border-t-transparent',
    left: 'right-[-6px] top-1/2 -translate-y-1/2 border-l-gray-700 border-t-transparent border-b-transparent border-r-transparent',
    right: 'left-[-6px] top-1/2 -translate-y-1/2 border-r-gray-700 border-t-transparent border-b-transparent border-l-transparent'
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={`absolute z-50 ${positions[position]} ${className}`}
          >
            <div className="bg-gray-700 text-white text-sm rounded-lg py-1 px-2 max-w-xs">
              {content}
            </div>
            <div
              className={`absolute w-0 h-0 border-4 ${arrows[position]}`}
              aria-hidden="true"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;