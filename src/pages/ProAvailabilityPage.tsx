import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Home, 
  User, 
  LogOut, 
  Settings, 
  Save,
  MapPin,
  Sliders,
  MessageSquare,
  DollarSign,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = [
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
];

const ProAvailabilityPage = () => {
  const [availability, setAvailability] = useState({
    Monday: { available: true, startTime: '8:00 AM', endTime: '6:00 PM' },
    Tuesday: { available: true, startTime: '8:00 AM', endTime: '6:00 PM' },
    Wednesday: { available: true, startTime: '8:00 AM', endTime: '6:00 PM' },
    Thursday: { available: true, startTime: '8:00 AM', endTime: '6:00 PM' },
    Friday: { available: true, startTime: '8:00 AM', endTime: '6:00 PM' },
    Saturday: { available: false, startTime: '9:00 AM', endTime: '5:00 PM' },
    Sunday: { available: false, startTime: '9:00 AM', endTime: '5:00 PM' }
  });
  
  const [workRadius, setWorkRadius] = useState(15);
  const [jobTypes, setJobTypes] = useState({
    standard: true,
    deep: true,
    moveIn: true,
    airbnb: true,
    office: false
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAvailabilityChange = (day, field, value) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        [field]: value
      }
    });
  };

  const handleJobTypeChange = (type) => {
    setJobTypes({
      ...jobTypes,
      [type]: !jobTypes[type]
    });
  };

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
                    <Link to="/availability" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-700">
                      <Sliders className="w-5 h-5" />
                      <span>Availability</span>
                    </Link>
                    <Link to="/settings" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
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
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Availability & Preferences</h1>
                <button 
                  onClick={handleSaveSettings}
                  className="btn btn-primary flex items-center"
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
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Your availability and preferences have been saved successfully.</span>
                </div>
              )}
              
              {/* Weekly Availability */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Weekly Availability</h2>
                  <p className="text-sm text-gray-500 mt-1">Set your regular working hours for each day of the week.</p>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-gray-900">{day}</h3>
                          <div className="flex items-center">
                            <span className="mr-3 text-sm text-gray-500">Available</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer"
                                checked={availability[day].available}
                                onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                        
                        {availability[day].available && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Time
                              </label>
                              <select
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                value={availability[day].startTime}
                                onChange={(e) => handleAvailabilityChange(day, 'startTime', e.target.value)}
                              >
                                {timeSlots.map((time) => (
                                  <option key={`start-${time}`} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Time
                              </label>
                              <select
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                value={availability[day].endTime}
                                onChange={(e) => handleAvailabilityChange(day, 'endTime', e.target.value)}
                              >
                                {timeSlots.map((time) => (
                                  <option key={`end-${time}`} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Work Preferences */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Work Preferences</h2>
                  <p className="text-sm text-gray-500 mt-1">Set your job preferences and work radius.</p>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Work Radius
                    </label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={workRadius}
                        onChange={(e) => setWorkRadius(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="ml-3 text-gray-900 font-medium">{workRadius} miles</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      You'll only see jobs within {workRadius} miles of your location.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Types
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                      Select the types of cleaning jobs you're willing to accept.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          id="standard"
                          name="standard"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={jobTypes.standard}
                          onChange={() => handleJobTypeChange('standard')}
                        />
                        <label htmlFor="standard" className="ml-3 block text-sm font-medium text-gray-700">
                          Standard Home Cleaning
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="deep"
                          name="deep"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={jobTypes.deep}
                          onChange={() => handleJobTypeChange('deep')}
                        />
                        <label htmlFor="deep" className="ml-3 block text-sm font-medium text-gray-700">
                          Deep Cleaning
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="moveIn"
                          name="moveIn"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={jobTypes.moveIn}
                          onChange={() => handleJobTypeChange('moveIn')}
                        />
                        <label htmlFor="moveIn" className="ml-3 block text-sm font-medium text-gray-700">
                          Move-In/Move-Out Cleaning
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="airbnb"
                          name="airbnb"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={jobTypes.airbnb}
                          onChange={() => handleJobTypeChange('airbnb')}
                        />
                        <label htmlFor="airbnb" className="ml-3 block text-sm font-medium text-gray-700">
                          Airbnb/Rental Cleaning
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="office"
                          name="office"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={jobTypes.office}
                          onChange={() => handleJobTypeChange('office')}
                        />
                        <label htmlFor="office" className="ml-3 block text-sm font-medium text-gray-700">
                          Office Cleaning
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Advanced Settings */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div 
                  className="px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <h2 className="text-lg font-medium text-gray-900">Advanced Settings</h2>
                  {showAdvanced ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                
                {showAdvanced && (
                  <div className="p-6">
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Job Pay
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                          placeholder="0.00"
                          defaultValue="50"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">USD</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        You'll only see jobs that pay at least this amount.
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Client Rating
                      </label>
                      <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        defaultValue="3.5"
                      >
                        <option value="0">Any rating</option>
                        <option value="3.0">3.0+</option>
                        <option value="3.5">3.5+</option>
                        <option value="4.0">4.0+</option>
                        <option value="4.5">4.5+</option>
                      </select>
                      <p className="mt-2 text-sm text-gray-500">
                        You'll only see jobs from clients with at least this rating.
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Automatic Job Acceptance
                      </label>
                      <div className="flex items-center">
                        <input
                          id="auto-accept"
                          name="auto-accept"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          defaultChecked={false}
                        />
                        <label htmlFor="auto-accept" className="ml-3 block text-sm font-medium text-gray-700">
                          Automatically accept jobs that match my preferences
                        </label>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        When enabled, jobs that match all your preferences will be automatically accepted.
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notification Preferences
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            id="notify-email"
                            name="notify-email"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            defaultChecked={true}
                          />
                          <label htmlFor="notify-email" className="ml-3 block text-sm font-medium text-gray-700">
                            Email notifications for new jobs
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="notify-sms"
                            name="notify-sms"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            defaultChecked={true}
                          />
                          <label htmlFor="notify-sms" className="ml-3 block text-sm font-medium text-gray-700">
                            SMS notifications for new jobs
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="notify-push"
                            name="notify-push"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            defaultChecked={true}
                          />
                          <label htmlFor="notify-push" className="ml-3 block text-sm font-medium text-gray-700">
                            Push notifications for new jobs
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProAvailabilityPage;