import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, MapPin, Navigation } from 'lucide-react';

interface JobStatusButtonProps {
  status: 'pending' | 'on_way' | 'in_progress' | 'completed';
  jobId: string;
  startTime: string;
  onStatusChange: (jobId: string, newStatus: string) => void;
}

const JobStatusButton: React.FC<JobStatusButtonProps> = ({
  status,
  jobId,
  startTime,
  onStatusChange
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onStatusChange(jobId, newStatus);
    setIsLoading(false);
    setShowConfirm(false);
  };

  const getButtonStyle = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'on_way':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Mark "On My Way"';
      case 'on_way':
        return 'Start Job';
      case 'in_progress':
        return 'Complete Job';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown Status';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'on_way':
        return <Navigation className="w-5 h-5" />;
      case 'in_progress':
        return <MapPin className="w-5 h-5" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getNextStatus = () => {
    switch (status) {
      case 'pending':
        return 'on_way';
      case 'on_way':
        return 'in_progress';
      case 'in_progress':
        return 'completed';
      default:
        return status;
    }
  };

  // Check if "On My Way" button should be enabled (within 1 hour of start time)
  const canMarkOnWay = () => {
    if (status !== 'pending') return true;
    
    const jobTime = new Date(startTime).getTime();
    const now = new Date().getTime();
    const oneHour = 60 * 60 * 1000;
    
    return jobTime - now <= oneHour;
  };

  if (status === 'completed') {
    return (
      <div className={`px-4 py-2 rounded-lg flex items-center ${getButtonStyle()}`}>
        <CheckCircle className="w-5 h-5 mr-2" />
        Completed
      </div>
    );
  }

  return (
    <>
      <button
        className={`px-4 py-2 rounded-lg flex items-center ${getButtonStyle()} ${
          !canMarkOnWay() ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={() => setShowConfirm(true)}
        disabled={!canMarkOnWay() || isLoading}
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          getStatusIcon()
        )}
        <span className="ml-2">{getStatusText()}</span>
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold mb-4">
              Confirm Status Change
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to mark this job as "{getStatusText()}"?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => handleStatusChange(getNextStatus())}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default JobStatusButton;