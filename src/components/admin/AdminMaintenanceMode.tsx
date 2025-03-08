import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Clock, Users, CheckCircle } from 'lucide-react';
import { adminService } from '../../lib/adminService';

const AdminMaintenanceMode: React.FC = () => {
  const [maintenanceDetails, setMaintenanceDetails] = useState({
    startTime: '',
    duration: '',
    impact: 'partial', // 'partial' or 'full'
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      await adminService.sendMaintenanceNotification({
        startTime: maintenanceDetails.startTime,
        duration: maintenanceDetails.duration,
        impact: maintenanceDetails.impact
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError('Failed to schedule maintenance');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Schedule Maintenance</h2>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 text-green-600 p-4 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Maintenance scheduled successfully
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              type="datetime-local"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={maintenanceDetails.startTime}
              onChange={(e) => setMaintenanceDetails({
                ...maintenanceDetails,
                startTime: e.target.value
              })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration
            </label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., 2 hours"
              value={maintenanceDetails.duration}
              onChange={(e) => setMaintenanceDetails({
                ...maintenanceDetails,
                duration: e.target.value
              })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Impact Level
            </label>
            <select
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={maintenanceDetails.impact}
              onChange={(e) => setMaintenanceDetails({
                ...maintenanceDetails,
                impact: e.target.value
              })}
              required
            >
              <option value="partial">Partial (Some features unavailable)</option>
              <option value="full">Full (System completely offline)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maintenance Message
            </label>
            <textarea
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              rows={4}
              placeholder="Describe the maintenance work and its impact..."
              value={maintenanceDetails.message}
              onChange={(e) => setMaintenanceDetails({
                ...maintenanceDetails,
                message: e.target.value
              })}
              required
            ></textarea>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Important Notice
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>All affected users will be notified via email</li>
                    <li>Active sessions will be preserved when possible</li>
                    <li>Schedule maintenance during low-traffic periods</li>
                    <li>Consider time zones when scheduling</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setMaintenanceDetails({
                startTime: '',
                duration: '',
                impact: 'partial',
                message: ''
              })}
            >
              Reset
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Scheduling...
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule Maintenance
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminMaintenanceMode;