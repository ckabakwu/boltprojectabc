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
  MessageSquare
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const DashboardHomePage = () => {
  const [activeTab, setActiveTab] = useState('overview');

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
                      <h3 className="font-semibold">John Smith</h3>
                      <p className="text-sm text-gray-500">Customer</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <nav className="space-y-1">
                    <Link to="/customer-dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-700">
                      <Home className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link to="/bookings" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                      <Calendar className="w-5 h-5" />
                      <span>My Bookings</span>
                    </Link>
                    <Link to="/notifications" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                      <Bell className="w-5 h-5" />
                      <span>Notifications</span>
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
              
              <div className="mt-6 bg-blue-600 rounded-xl shadow-md overflow-hidden text-white">
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Need another cleaning?</h3>
                  <p className="text-blue-100 mb-4">Book your next appointment in just a few clicks.</p>
                  <Link to="/booking" className="btn bg-white text-blue-600 hover:bg-blue-50 w-full">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-grow">
              <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-500">This Month</span>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium">Total Bookings</h3>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Next cleaning: Jun 15
                  </p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-green-100 p-3 rounded-full">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-500">Last 30 Days</span>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium">Amount Spent</h3>
                  <p className="text-2xl font-bold">$480</p>
                  <p className="text-sm text-gray-500 mt-2">
                    4 cleanings
                  </p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <span className="text-sm text-gray-500">Average</span>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium">Cleaner Rating</h3>
                  <p className="text-2xl font-bold">4.9</p>
                  <p className="text-sm text-gray-500 mt-2">
                    12 reviews given
                  </p>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Upcoming Cleaning</p>
                        <p className="text-sm text-gray-500">Standard Cleaning on June 15 at 10:00 AM</p>
                        <div className="mt-2">
                          <Link to="/bookings/123" className="text-sm text-blue-600 hover:text-blue-800">
                            View Details
                          </Link>
                        </div>
                      </div>
                      <span className="ml-auto text-sm text-gray-500">2 days away</span>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Cleaning Completed</p>
                        <p className="text-sm text-gray-500">Deep Cleaning on June 1</p>
                        <div className="mt-2">
                          <Link to="/bookings/122" className="text-sm text-blue-600 hover:text-blue-800">
                            Leave a Review
                          </Link>
                        </div>
                      </div>
                      <span className="ml-auto text-sm text-gray-500">2 weeks ago</span>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Star className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Review Posted</p>
                        <p className="text-sm text-gray-500">You gave Maria R. a 5-star rating</p>
                        <div className="mt-2">
                          <Link to="/reviews/456" className="text-sm text-blue-600 hover:text-blue-800">
                            View Review
                          </Link>
                        </div>
                      </div>
                      <span className="ml-auto text-sm text-gray-500">2 weeks ago</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Saved Addresses */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">Saved Addresses</h2>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Add New
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <Home className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">Home</p>
                          <p className="text-sm text-gray-500">123 Main St, Apt 4B</p>
                          <p className="text-sm text-gray-500">New York, NY 10001</p>
                        </div>
                      </div>
                      <button className="text-sm text-gray-500 hover:text-gray-700">
                        Edit
                      </button>
                    </div>
                    
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <Briefcase className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">Office</p>
                          <p className="text-sm text-gray-500">456 Park Ave, Suite 789</p>
                          <p className="text-sm text-gray-500">New York, NY 10022</p>
                        </div>
                      </div>
                      <button className="text-sm text-gray-500 hover:text-gray-700">
                        Edit
                      </button>
                    </div>
                  </div>
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

export default DashboardHomePage;