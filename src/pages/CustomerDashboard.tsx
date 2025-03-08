import React, { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
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
import BookingsPage from './dashboard/BookingsPage';
import PaymentsPage from './dashboard/PaymentsPage';
import SettingsPage from './dashboard/SettingsPage';
import PointsWidget from '../components/dashboard/PointsWidget';

// Mock data for points and rewards
const pointsData = {
  points: 750,
  level: 'Silver',
  nextLevelPoints: 1000,
  rewards: [
    {
      id: '1',
      name: '$10 Off Cleaning',
      description: 'Get $10 off your next cleaning service',
      pointsRequired: 500,
      discountAmount: 10
    },
    {
      id: '2',
      name: '$25 Off Deep Cleaning',
      description: 'Get $25 off a deep cleaning service',
      pointsRequired: 1000,
      discountAmount: 25
    },
    {
      id: '3',
      name: 'Free Standard Cleaning',
      description: 'Get a free standard cleaning service',
      pointsRequired: 2500,
      discountAmount: 120
    }
  ]
};

const CustomerDashboard = () => {
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
                <h3 className="font-semibold">John Smith</h3>
                <p className="text-sm text-gray-500">john.smith@example.com</p>
              </div>
            </div>
          </div>
          
          <nav className="p-4 space-y-1">
            <Link to="/customer-dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-700">
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link to="/customer-dashboard/bookings" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
              <Calendar className="w-5 h-5" />
              <span>My Bookings</span>
            </Link>
            <Link to="/customer-dashboard/payments" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
              <DollarSign className="w-5 h-5" />
              <span>Payments</span>
            </Link>
            <Link to="/customer-dashboard/settings" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
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
          <Routes>
            <Route path="/" element={
              <div>
                <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
                
                {/* Points Widget */}
                <div className="mb-8">
                  <PointsWidget {...pointsData} />
                </div>
                
                {/* Other dashboard content */}
              </div>
            } />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;