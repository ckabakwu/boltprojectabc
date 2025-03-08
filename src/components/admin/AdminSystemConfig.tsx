import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import { adminService } from '../../lib/adminService';

const AdminSystemConfig: React.FC = () => {
  const [config, setConfig] = useState({
    bookingSettings: {
      minAdvanceTime: 2,
      maxAdvanceTime: 30,
      cancellationWindow: 24,
      autoConfirm: false
    },
    emailSettings: {
      sendBookingConfirmations: true,
      sendReminders: true,
      reminderHours: 24,
      sendReviewRequests: true
    },
    paymentSettings: {
      platformFee: 20,
      payoutFrequency: 'biweekly',
      minimumPayout: 50
    },
    systemSettings: {
      maintenanceMode: false,
      debugMode: false,
      maxLoginAttempts: 5,
      sessionTimeout: 30
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await adminService.getSystemConfig();
      setConfig(data);
    } catch (error) {
      setError('Failed to load system configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess(false);

    try {
      await adminService.updateSystemConfig(config);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError('Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Configuration saved successfully
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">System Configuration</h2>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Booking Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Minimum Advance Booking Time (hours)
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={config.bookingSettings.minAdvanceTime}
                    onChange={(e) => setConfig({
                      ...config,
                      bookingSettings: {
                        ...config.bookingSettings,
                        minAdvanceTime: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Maximum Advance Booking Time (days)
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={config.bookingSettings.maxAdvanceTime}
                    onChange={(e) => setConfig({
                      ...config,
                      bookingSettings: {
                        ...config.bookingSettings,
                        maxAdvanceTime: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cancellation Window (hours)
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={config.bookingSettings.cancellationWindow}
                    onChange={(e) => setConfig({
                      ...config,
                      bookingSettings: {
                        ...config.bookingSettings,
                        cancellationWindow: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={config.bookingSettings.autoConfirm}
                    onChange={(e) => setConfig({
                      ...config,
                      bookingSettings: {
                        ...config.bookingSettings,
                        autoConfirm: e.target.checked
                      }
                    })}
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Auto-confirm bookings
                  </label>
                </div>
              </div>
            </div>

            {/* Email Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Email Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={config.emailSettings.sendBookingConfirmations}
                    onChange={(e) => setConfig({
                      ...config,
                      emailSettings: {
                        ...config.emailSettings,
                        sendBookingConfirmations: e.target.checked
                      }
                    })}
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Send booking confirmations
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={config.emailSettings.sendReminders}
                    onChange={(e) => setConfig({
                      ...config,
                      emailSettings: {
                        ...config.emailSettings,
                        sendReminders: e.target.checked
                      }
                    })}
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Send booking reminders
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Reminder Hours Before Booking
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={config.emailSettings.reminderHours}
                    onChange={(e) => setConfig({
                      ...config,
                      emailSettings: {
                        ...config.emailSettings,
                        reminderHours: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={config.emailSettings.sendReviewRequests}
                    onChange={(e) => setConfig({
                      ...config,
                      emailSettings: {
                        ...config.emailSettings,
                        sendReviewRequests: e.target.checked
                      }
                    })}
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Send review requests
                  </label>
                </div>
              </div>
            </div>

            {/* Payment Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Platform Fee (%)
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={config.paymentSettings.platformFee}
                    onChange={(e) => setConfig({
                      ...config,
                      paymentSettings: {
                        ...config.paymentSettings,
                        platformFee: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payout Frequency
                  </label>
                  <select
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={config.paymentSettings.payoutFrequency}
                    onChange={(e) => setConfig({
                      ...config,
                      paymentSettings: {
                        ...config.paymentSettings,
                        payoutFrequency: e.target.value
                      }
                    })}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                 <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Minimum Payout Amount ($)
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={config.paymentSettings.minimumPayout}
                    onChange={(e) => setConfig({
                      ...config,
                      paymentSettings: {
                        ...config.paymentSettings,
                        minimumPayout: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* System Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">System Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={config.systemSettings.maintenanceMode}
                    onChange={(e) => setConfig({
                      ...config,
                      systemSettings: {
                        ...config.systemSettings,
                        maintenanceMode: e.target.checked
                      }
                    })}
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Maintenance Mode
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={config.systemSettings.debugMode}
                    onChange={(e) => setConfig({
                      ...config,
                      systemSettings: {
                        ...config.systemSettings,
                        debugMode: e.target.checked
                      }
                    })}
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Debug Mode
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Maximum Login Attempts
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={config.systemSettings.maxLoginAttempts}
                    onChange={(e) => setConfig({
                      ...config,
                      systemSettings: {
                        ...config.systemSettings,
                        maxLoginAttempts: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={config.systemSettings.sessionTimeout}
                    onChange={(e) => setConfig({
                      ...config,
                      systemSettings: {
                        ...config.systemSettings,
                        sessionTimeout: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemConfig;