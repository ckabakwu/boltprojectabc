import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Home, 
  User, 
  LogOut, 
  Settings, 
  Save,
  Mail,
  Phone,
  Camera,
  Lock,
  Sliders,
  MessageSquare,
  DollarSign,
  CheckCircle,
  Shield,
  Bell
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [email, setEmail] = useState('maria.rodriguez@example.com');
  const [phone, setPhone] = useState('(555) 123-4567');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState({
    newJobs: true,
    jobReminders: true,
    payments: true,
    promotions: false
  });
  const [pushNotifications, setPushNotifications] = useState({
    newJobs: true,
    jobReminders: true,
    payments: true,
    promotions: false
  });
  const [smsNotifications, setSmsNotifications] = useState({
    newJobs: true,
    jobReminders: true,
    payments: false,
    promotions: false
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleEmailNotificationChange = (setting: string) => {
    setEmailNotifications({
      ...emailNotifications,
      [setting]: !emailNotifications[setting]
    });
  };

  const handlePushNotificationChange = (setting: string) => {
    setPushNotifications({
      ...pushNotifications,
      [setting]: !pushNotifications[setting]
    });
  };

  const handleSmsNotificationChange = (setting: string) => {
    setSmsNotifications({
      ...smsNotifications,
      [setting]: !smsNotifications[setting]
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container-narrow">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Maria Rodriguez</h3>
                      <p className="text-sm text-gray-500">Professional Cleaner</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <nav className="space-y-1">
                    <Link to="/pro-dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                      <Home className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link to="/available-jobs" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                      <Calendar className="w-5 h-5" />
                      <span>Available Jobs</span>
                    </Link>
                    <Link to="/my-jobs" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                      <CheckCircle className="w-5 h-5" />
                      <span>My Jobs</span>
                    </Link>
                    <Link to="/earnings" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                      <DollarSign className="w-5 h-5" />
                      <span>Earnings</span>
                    </Link>
                    <Link to="/messages" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                      <MessageSquare className="w-5 h-5" />
                      <span>Messages</span>
                    </Link>
                    <Link to="/availability" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                      <Sliders className="w-5 h-5" />
                      <span>Availability</span>
                    </Link>
                    <Link to="/settings" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-700">
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </Link>
                    <Link to="/logout" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-grow">
              <h1 className="text-2xl font-bold mb-6">Settings</h1>
              
              {saveSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Your settings have been saved successfully.</span>
                </div>
              )}
              
              {/* Tabs */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                        activeTab === 'profile'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => setActiveTab('security')}
                      className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                        activeTab === 'security'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Security
                    </button>
                    <button
                      onClick={() => setActiveTab('notifications')}
                      className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                        activeTab === 'notifications'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Notifications
                    </button>
                  </nav>
                </div>
                
                <div className="p-6">
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <form onSubmit={handleSaveProfile}>
                      <div className="space-y-6">
                        {/* Profile Photo */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Photo
                          </label>
                          <div className="flex items-center">
                            <div className="relative">
                              <img
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
                                alt="Profile"
                                className="h-24 w-24 rounded-full object-cover"
                              />
                              <button
                                type="button"
                                className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 text-white shadow-md hover:bg-blue-700"
                              >
                                <Camera className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="ml-5">
                              <div className="text-sm text-gray-500">
                                JPG, GIF or PNG. 1MB max.
                              </div>
                              <button
                                type="button"
                                className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Change Photo
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Personal Information */}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                          
                          <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                              <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                First name
                              </label>
                              <input
                                type="text"
                                name="first-name"
                                id="first-name"
                                autoComplete="given-name"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                defaultValue="Maria"
                                disabled
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                Name cannot be changed. Contact support if needed.
                              </p>
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                              <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                                Last name
                              </label>
                              <input
                                type="text"
                                name="last-name"
                                id="last-name"
                                autoComplete="family-name"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                defaultValue="Rodriguez"
                                disabled
                              />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  type="email"
                                  name="email"
                                  id="email"
                                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                  placeholder="you@example.com"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone number
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  type="tel"
                                  name="phone"
                                  id="phone"
                                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                  placeholder="(555) 123-4567"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            type="submit"
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
                    </form>
                  )}
                  
                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      {/* Change Password */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                        <form onSubmit={handleChangePassword}>
                          <div className="space-y-4">
                            <div>
                              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                                Current Password
                              </label> <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  type="password"
                                  name="current-password"
                                  id="current-password"
                                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                  value={currentPassword}
                                  onChange={(e) => setCurrentPassword(e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                                New Password
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  type="password"
                                  name="new-password"
                                  id="new-password"
                                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  required
                                />
                              </div>
                              <p className="mt-1 text-xs text-gray-500">
                                Password must be at least 8 characters and include a number and special character.
                              </p>
                            </div>
                            
                            <div>
                              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                Confirm New Password
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  type="password"
                                  name="confirm-password"
                                  id="confirm-password"
                                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                            
                            <div className="flex justify-end">
                              <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={isSaving}
                              >
                                {isSaving ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                  </>
                                ) : (
                                  <>
                                    <Save className="mr-2" size={18} />
                                    Update Password
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                      
                      {/* Two-Factor Authentication */}
                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="two-factor"
                              name="two-factor"
                              type="checkbox"
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              defaultChecked={true}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="two-factor" className="font-medium text-gray-700">Enable two-factor authentication</label>
                            <p className="text-gray-500">Add an extra layer of security to your account by requiring both your password and a verification code.</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Account Security */}
                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
                        <div className="bg-blue-50 p-4 rounded-md flex items-start">
                          <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                          <div>
                            <h4 className="text-sm font-medium text-blue-800">Your account is secure</h4>
                            <p className="mt-1 text-sm text-blue-700">
                              Your account has strong security settings. Last login: June 10, 2025 at 9:30 AM.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Notifications Tab */}
                  {activeTab === 'notifications' && (
                    <div className="space-y-6">
                      {/* Email Notifications */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="email-new-jobs"
                                name="email-new-jobs"
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                checked={emailNotifications.newJobs}
                                onChange={() => handleEmailNotificationChange('newJobs')}
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="email-new-jobs" className="font-medium text-gray-700">New job opportunities</label>
                              <p className="text-gray-500">Get notified when new jobs are available in your area.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="email-job-reminders"
                                name="email-job-reminders"
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                checked={emailNotifications.jobReminders}
                                onChange={() => handleEmailNotificationChange('jobReminders')}
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="email-job-reminders" className="font-medium text-gray-700">Job reminders</label>
                              <p className="text-gray-500">Receive reminders about upcoming jobs.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="email-payments"
                                name="email-payments"
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                checked={emailNotifications.payments}
                                onChange={() => handleEmailNotificationChange('payments')}
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="email-payments" className="font-medium text-gray-700">Payment notifications</label>
                              <p className="text-gray-500">Get notified about payments and payouts.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="email-promotions"
                                name="email-promotions"
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                checked={emailNotifications.promotions}
                                onChange={() => handleEmailNotificationChange('promotions')}
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="email-promotions" className="font-medium text-gray-700">Promotions and updates</label>
                              <p className="text-gray-500">Receive updates about new features and promotions.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Push Notifications */}
                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Push Notifications</h3>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="push-new-jobs"
                                name="push-new-jobs"
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                checked={pushNotifications.newJobs}
                                onChange={() => handlePushNotificationChange('newJobs')}
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="push-new-jobs" className="font-medium text-gray-700">New job opportunities</label>
                              <p className="text-gray-500">Get notified when new jobs are available in your area.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="push-job-reminders"
                                name="push-job-reminders"
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                checked={pushNotifications.jobReminders}
                                onChange={() => handlePushNotificationChange('jobReminders')}
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="push-job-reminders" className="font-medium text-gray-700">Job reminders</label>
                              <p className="text-gray-500">Receive reminders about upcoming jobs.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="push-payments"
                                name="push-payments"
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                checked={pushNotifications.payments}
                                onChange={() => handlePushNotificationChange('payments')}
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="push-payments" className="font-medium text-gray-700">Payment notifications</label>
                              <p className="text-gray-500">Get notified about payments and payouts.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="push-promotions"
                                name="push-promotions"
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                checked={pushNotifications.promotions}
                                onChange={() => handlePushNotificationChange('promotions')}
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="push-promotions" className="font-medium text-gray-700">Promotions and updates</label>
                              <p className="text-gray-500">Receive updates about new features and promotions.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* SMS Notifications */}
                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">SMS Notifications</h3>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="sms-new-jobs"
                                name="sms-new-jobs"
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                checked={smsNotifications.newJobs}
                                onChange={() => handleSmsNotificationChange('newJobs')}
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="sms-new-jobs" className="font-medium text-gray-700">New job opportunities</label>
                              <p className="text-gray-500">Get notified when new jobs are available in your area.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="sms-job-reminders"
                                name="sms-job-reminders"
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                checked={smsNotifications.jobReminders}
                                onChange={() => handleSmsNotificationChange('jobReminders')}
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="sms-job-reminders" className="font-medium text-gray-700">Job reminders</label>
                              <p className="text-gray-500">Receive reminders about upcoming jobs.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="sms-payments"
                                name="sms-payments"
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                checked={smsNotifications.payments}
                                onChange={() => handleSmsNotificationChange('payments')}
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="sms-payments" className="font-medium text-gray-700">Payment notifications</label>
                              <p className="text-gray-500">Get notified about payments and payouts.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="sms-promotions"
                                name="sms-promotions"
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                checked={smsNotifications.promotions}
                                onChange={() => handleSmsNotificationChange('promotions')}
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="sms-promotions" className="font-medium text-gray-700">Promotions and updates</label>
                              <p className="text-gray-500">Receive updates about new features and promotions.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-6">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => setSaveSuccess(true)}
                        >
                          <Bell className="mr-2" size={18} />
                          Save Notification Preferences
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Account Deactivation */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Account Deactivation</h2>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-4">
                    Deactivating your account will remove you from the platform and cancel all your upcoming jobs. This action cannot be undone.
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Deactivate Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProSettingsPage;