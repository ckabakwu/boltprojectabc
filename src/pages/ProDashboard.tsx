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
  Bell, 
  Star, 
  ChevronRight, 
  DollarSign,
  MapPin,
  CheckCircle,
  Sliders,
  MessageSquare,
  List,
  Grid
} from 'lucide-react';
import ProCalendar from '../components/dashboard/ProCalendar';

// Mock data for jobs
const upcomingJobs = [
  {
    id: 1,
    date: '2025-06-15',
    time: '10:00',
    service: 'Standard Cleaning',
    address: '123 Main St, Apt 4B',
    status: 'confirmed',
    payment: 85,
    client: {
      name: 'John Smith',
      rating: 4.8
    },
    estimatedDuration: '2 hours'
  }
];

const ProDashboard = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');

  const handleDateSelect = (date: Date) => {
    console.log('Selected date:', date);
    // Handle date selection - could filter jobs, etc.
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 md:fixed md:top-0 md:bottom-0 md:left-0 bg-white border-r border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold">Maria Rodriguez</h3>
                <p className="text-sm text-gray-500">Professional Cleaner</p>
              </div>
            </div>
          </div>
          
          <nav className="p-4 space-y-1">
            <Link to="/pro-dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-700">
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link to="/pro-dashboard/availability" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
              <Calendar className="w-5 h-5" />
              <span>Availability</span>
            </Link>
            <Link to="/pro-dashboard/earnings" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
              <DollarSign className="w-5 h-5" />
              <span>Earnings</span>
            </Link>
            <Link to="/pro-dashboard/messages" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </Link>
            <Link to="/pro-dashboard/settings" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
            <Link to="/logout" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="md:ml-64 flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Pro Dashboard</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded-lg ${
                  viewMode === 'calendar' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
            </div>
          </div>

          {viewMode === 'calendar' ? (
            <ProCalendar 
              jobs={upcomingJobs}
              onDateSelect={handleDateSelect}
            />
          ) : (
            <div className="space-y-6">
              {upcomingJobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white shadow rounded-lg overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div className="flex items-center mb-3 md:mb-0">
                        <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="font-semibold">{job.date}</span>
                        <span className="mx-2 text-gray-400">|</span>
                        <Clock className="w-5 h-5 text-blue-600 mr-2" />
                        <span>{job.time}</span>
                      </div>
                      <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {job.status}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg">{job.service}</h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{job.address}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{job.client.name}</p>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm ml-1">{job.client.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-green-600 font-medium">
                        <DollarSign className="w-5 h-5 mr-1" />
                        {job.payment}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProDashboard;