import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';

interface PreferredProButtonProps {
  providerId: string;
  isPreferred: boolean;
  onToggle: (preferred: boolean) => Promise<void>;
}

const PreferredProButton: React.FC<PreferredProButtonProps> = ({
  providerId,
  isPreferred,
  onToggle
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleClick = async () => {
    if (isPreferred) {
      setShowConfirmation(true);
      return;
    }

    setIsLoading(true);
    try {
      await onToggle(true);
    } catch (error) {
      console.error('Error updating preferred status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmRemove = async () => {
    setIsLoading(true);
    try {
      await onToggle(false);
    } catch (error) {
      console.error('Error updating preferred status:', error);
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }
  };

  if (showConfirmation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-4"
      >
        <p className="text-sm text-gray-700 mb-4">
          Are you sure you want to remove this pro from your preferred list?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowConfirmation(false)}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmRemove}
            disabled={isLoading}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            {isLoading ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
        isPreferred
          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : isPreferred ? (
        <>
          <CheckCircle className="h-4 w-4 mr-1" />
          Preferred Pro
        </>
      ) : (
        <>
          <Star className="h-4 w-4 mr-1" />
          Mark as Preferred
        </>
      )}
    </button>
  );
};

export default PreferredProButton;