import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail,
  MessageSquare,
  Clock,
  DollarSign,
  Save,
  CheckCircle,
  Settings,
  Bell,
  Calendar,
  User,
  CreditCard,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const AdminAutomationsPage = () => {
  // Email notification settings
  const [emailSettings, setEmailSettings] = useState({
    bookingConfirmation: true,
    bookingReminder: true,
    bookingModification: true,
    paymentConfirmation: true,
    cleanerAssigned: true,
    reviewRequest: true,
    proApplicationStatus: true,
    proPayoutConfirmation: true
  });

  // SMS notification settings
  const [smsSettings, setSmsSettings] = useState({
    bookingConfirmation: true,
    bookingReminder: true,
    cleanerArrival: true,
    urgentUpdates: true
  });

  // Booking rules settings
  const [bookingRules, setBookingRules] = useState({
    minAdvanceBooking: '2',
    maxAdvanceBooking: '30',
    minBookingDuration: '2',
    maxBookingDuration: '8',
    allowSameDay: true,
    allowWeekends: true,
    requirePhoneVerification: true,
    autoConfirmBookings: false,
    cancelationWindow: '24'
  });

  // Payout settings
  const [payoutSettings, setPayoutSettings] = useState({
    frequency: 'biweekly',
    minimumAmount: '50',
    processingDay: 'monday',
    holdPeriod: '3',
    autoApprove: true,
    platformFee: '20'
  });

  const [activeSection, setActiveSection] = useState('all');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = () => {
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Automation Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Configure automated notifications, booking rules, and payout settings.
            </p>
          </div>
          
          <button 
            onClick={handleSaveSettings}
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
        
        {saveSuccess && (
          <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Settings have been saved successfully.</span>
          </div>
        )}
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Email Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mail className="h-6 w-6 text-gray-400 mr-3" />
                <h2 className="text-lg font-medium text-gray-900">Email Notifications</h2>
              </div>
              <button
                onClick={() => setActiveSection(activeSection === 'email' ? 'all' : 'email')}
                className="text-gray-400 hover:text-gray-500"
              >
                {activeSection === 'email' ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          {(activeSection === 'all' || activeSection === 'email') && (
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Booking Confirmation</h3>
                    <p className="text-sm text-gray-500">Send confirmation emails when bookings are made</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={emailSettings.bookingConfirmation}
                      onChange={(e) => setEmailSettings({...emailSettings, bookingConfirmation: e.target.checked})}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Booking Reminder</h3>
                    <p className="text-sm text-gray-500">Send reminder emails 24 hours before scheduled service</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={emailSettings.bookingReminder}
                      onChange={(e) => setEmailSettings({...emailSettings, bookingReminder: e.target.checked})}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Payment Confirmation</h3>
                    <p className="text-sm text-gray-500">Send payment receipts and confirmations</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={emailSettings.paymentConfirmation}
                      onChange={(e) => setEmailSettings({...emailSettings, paymentConfirmation: e.target.checked})}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Cleaner Assignment</h3>
                    <p className="text-sm text-gray-500">Notify customers when a cleaner is assigned</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={emailSettings.cleanerAssigned}
                      onChange={(e) => setEmailSettings({...emailSettings, cleanerAssigned: e.target.checked})}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Review Request</h3>
                    <p className="text-sm text-gray-500">Send review requests after service completion</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={emailSettings.reviewRequest}
                      onChange={(e) => setEmailSettings({...emailSettings, reviewRequest: e.target.checked})}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* SMS Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare className="h-6 w-6 text-gray-400 mr-3" />
                <h2 className="text-lg font-medium text-gray-900">SMS Alerts</h2>
              </div>
              <button
                onClick={() => setActiveSection(activeSection === 'sms' ? 'all' : 'sms')}
                className="text-gray-400 hover:text-gray-500"
              >
                {activeSection === 'sms' ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          {(activeSection === 'all' || activeSection === 'sms') && (
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Booking Confirmation</h3>
                    <p className="text-sm text-gray-500">Send SMS confirmation for new bookings</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={smsSettings.bookingConfirmation}
                      onChange={(e) => setSmsSettings({...smsSettings, bookingConfirmation: e.target.checked})}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Booking Reminder</h3>
                    <p className="text-sm text-gray-500">Send SMS reminders before scheduled service</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={smsSettings.bookingReminder}
                      onChange={(e) => setSmsSettings({...smsSettings, bookingReminder: e.target.checked})}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Cleaner Arrival</h3>
                    <p className="text-sm text-gray-500">Notify when cleaner is on the way</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={smsSettings.cleanerArrival}
                      onChange={(e) => setSmsSettings({...smsSettings, cleanerArrival: e.target.checked})}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Urgent Updates</h3>
                    <p className="text-sm text-gray-500">Send SMS for cancellations or urgent changes</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={smsSettings.urgentUpdates}
                      onChange={(e) => setSmsSettings({...smsSettings, urgentUpdates: e.target.checked})}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Booking Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Settings className="h-6 w-6 text-gray-400 mr-3" />
                <h2 className="text-lg font-medium text-gray-900">Booking Rules</h2>
              </div>
              <button
                onClick={() => setActiveSection(activeSection === 'booking' ? 'all' : 'booking')}
                className="text-gray-400 hover:text-gray-500"
              >
                {activeSection === 'booking' ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          {(activeSection === 'all' || activeSection === 'booking') && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Minimum Advance Booking (hours)
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={bookingRules.minAdvanceBooking}
                    onChange={(e) => setBookingRules({...bookingRules, minAdvanceBooking: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Maximum Advance Booking (days)
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={bookingRules.maxAdvanceBooking}
                    onChange={(e) => setBookingRules({...bookingRules, maxAdvanceBooking: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Minimum Booking Duration (hours)
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={bookingRules.minBookingDuration}
                    onChange={(e) => setBookingRules({...bookingRules, minBookingDuration: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Maximum Booking Duration (hours)
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={bookingRules.maxBookingDuration}
                    onChange={(e) => setBookingRules({...bookingRules, maxBookingDuration: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cancellation Window (hours)
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={bookingRules.cancelationWindow}
                    onChange={(e) => setBookingRules({...bookingRules, cancelationWindow: e.target.value})}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={bookingRules.allowSameDay}
                      onChange={(e) => setBookingRules({...bookingRules, allowSameDay: e.target.checked})}
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Allow same-day bookings
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={bookingRules.allowWeekends}
                      onChange={(e) => setBookingRules({...bookingRules, allowWeekends: e.target.checked})}
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Allow weekend bookings
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={bookingRules.requirePhoneVerification}
                      onChange={(e) => setBookingRules({...bookingRules, requirePhoneVerification: e.target.checked})}
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Require phone verification
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={bookingRules.autoConfirmBookings}
                      onChange={(e) => setBookingRules({...bookingRules, autoConfirmBookings: e.target.checked})}
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Auto-confirm bookings
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Payout Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 text-gray-400 mr-3" />
                <h2 className="text-lg font-medium text-gray-900">Payout Settings</h2>
              </div>
              <button
                onClick={() => setActiveSection(activeSection === 'payout' ? 'all' : 'payout')}
                className="text-gray-400 hover:text-gray-500"
              >
                {activeSection === 'payout' ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          {(activeSection === 'all' || activeSection === 'payout') && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payout Frequency
                  </label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={payoutSettings.frequency}
                    onChange={(e) => setPayoutSettings({...payoutSettings, frequency: e.target.value})}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Minimum Payout Amount
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                      value={payoutSettings.minimumAmount}
                      onChange={(e) => setPayoutSettings({...payoutSettings, minimumAmount: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Processing Day
                  </label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={payoutSettings.processingDay}
                    onChange={(e) => setPayoutSettings({...payoutSettings, processingDay: e.target.value})}
                  >
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hold Period (days)
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={payoutSettings.holdPeriod}
                    onChange={(e) => setPayoutSettings({...payoutSettings, holdPeriod: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Platform Fee (%)
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={payoutSettings.platformFee}
                    onChange={(e) => setPayoutSettings({...payoutSettings, platformFee: e.target.value})}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={payoutSettings.autoApprove}
                    onChange={(e) => setPayoutSettings({...payoutSettings, autoApprove: e.target.checked})}
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Auto-approve payouts
                  </label>
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Important Note
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Changes to payout settings will take effect from the next payout cycle. Current pending payouts will follow the existing rules.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAutomationsPage;