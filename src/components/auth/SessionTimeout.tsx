import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertCircle } from 'lucide-react';

interface SessionTimeoutProps {
  timeout: number; // in minutes
  warningTime: number; // in minutes
  onTimeout: () => void;
  onExtend: () => void;
}

const SessionTimeout: React.FC<SessionTimeoutProps> = ({
  timeout,
  warningTime,
  onTimeout,
  onExtend
}) => {
  const [timeRemaining, setTimeRemaining] = useState(timeout * 60);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          onTimeout();
          return 0;
        }
        
        // Show warning when warningTime is reached
        if (prev === warningTime * 60) {
          setShowWarning(true);
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeout, warningTime, onTimeout]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">
                Session Timeout Warning
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Your session will expire in {formatTime(timeRemaining)}. Would you like to extend your session?
                </p>
              </div>
              <div className="mt-4 flex space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {
                    onExtend();
                    setShowWarning(false);
                    setTimeRemaining(timeout * 60);
                  }}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Extend Session
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => onTimeout()}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SessionTimeout;