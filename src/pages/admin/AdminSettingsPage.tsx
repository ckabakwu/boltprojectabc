import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Save,
  Settings,
  Mail,
  Bell,
  Globe,
  Shield,
  Database,
  Server,
  CheckCircle,
  AlertCircle,
  Lock,
  Key,
  User
} from 'lucide-react';

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // General Settings
  const [siteName, setSiteName] = useState('HomeMaidy');
  const [supportEmail, setSupportEmail] = useState('support@homemaidy.com');
  const [timezone, setTimezone] = useState('America/New_York');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');

  // Security Settings
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');
  const [requireMFA, setRequireMFA] = useState(true);
  const [passwordExpiry, setPasswordExpiry] = useState('90');

  // Email Settings
  const [smtpHost, setSmtpHost] = useState('smtp.homemaidy.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('noreply@homemaidy.com');
  const [smtpPassword, setSmtpPassword] = useState('');

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure system-wide settings and preferences.
        </p>
      </div>

      {saveSuccess && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>Settings have been saved successfully.</span>
        </div>
      )}

      {/* Settings Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'general'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'email'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setActiveTab('maintenance')}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'maintenance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Maintenance
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="site-name" className="block text-sm font-medium text-gray-700">
                      Site Name
                    </label>
                    <input
                      type="text"
                      id="site-name"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="support-email" className="block text-sm font-medium text-gray-700">
                      Support Email
                    </label>
                    <input
                      type="email"
                      id="support-email"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                      Default Timezone
                    </label>
                    <select
                      id="timezone"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="date-format" className="block text-sm font-medium text-gray-700">
                      Date Format
                    </label>
                    <select
                      id="date-format"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="session-timeout" className="block text-sm font-medium text-gray-700">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      id="session-timeout"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="max-login-attempts" className="block text-sm font-medium text-gray-700">
                      Maximum Login Attempts
                    </label>
                    <input
                      type="number"
                      id="max-login-attempts"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={maxLoginAttempts}
                      onChange={(e) => setMaxLoginAttempts(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="password-expiry" className="block text-sm font-medium text-gray-700">
                      Password Expiry (days)
                    </label>
                    <input
                      type="number"
                      id="password-expiry"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={passwordExpiry}
                      onChange={(e) => setPasswordExpiry(e.target.value)}
                    />
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="require-mfa"
                        name="require-mfa"
                        type="checkbox"
                        checked={requireMFA}
                        onChange={(e) => setRequireMFA(e.target.checked)}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="require-mfa" className="font-medium text-gray-700">
                        Require Two-Factor Authentication
                      </label>
                      <p className="text-gray-500">Enforce 2FA for all admin users.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Settings</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="smtp-host" className="block text-sm font-medium text-gray-700">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      id="smtp-host"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="smtp-port" className="block text-sm font-medium text-gray-700">
                      SMTP Port
                    </label>
                    <input
                      type="text"
                      id="smtp-port"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="smtp-user" className="block text-sm font-medium text-gray-700">
                      SMTP Username
                    </label>
                    <input
                      type="text"
                      id="smtp-user"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={smtpUser}
                      onChange={(e) => setSmtpUser(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="smtp-password" className="block text-sm font-medium text-gray-700">
                      SMTP Password
                    </label>
                    <input
                      type="password"
                      id="smtp-password"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={smtpPassword}
                      onChange={(e) => setSmtpPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Test Email Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Maintenance Settings */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Maintenance Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="maintenance-mode"
                        name="maintenance-mode"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="maintenance-mode" className="font-medium text-gray-700">
                        Enable Maintenance Mode
                      </label>
                      <p className="text-gray-500">Put the site into maintenance mode.</p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="maintenance-message" className="block text-sm font-medium text-gray-700">
                      Maintenance Message
                    </label>
                    <textarea
                      id="maintenance-message"
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter maintenance message..."
                    ></textarea>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Enabling maintenance mode will prevent users from accessing the site.
                          Make sure to plan maintenance windows during off-peak hours.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSaving}
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
                  <Save className="mr-2" size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;