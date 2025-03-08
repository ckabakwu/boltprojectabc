import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Star,
  AlertTriangle,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Mock data for analytics
const analyticsData = {
  revenue: {
    total: 156780,
    growth: 12.5,
    lastPeriod: 139360,
    breakdown: {
      standardCleaning: 78390,
      deepCleaning: 45230,
      moveInOut: 23160,
      airbnb: 10000
    }
  },
  bookings: {
    total: 1250,
    growth: 8.3,
    lastPeriod: 1154,
    breakdown: {
      completed: 980,
      cancelled: 45,
      noShow: 15,
      disputed: 8
    }
  },
  customers: {
    total: 850,
    growth: 15.2,
    lastPeriod: 738,
    breakdown: {
      active: 620,
      inactive: 180,
      new: 50
    }
  },
  providers: {
    total: 95,
    growth: 5.5,
    lastPeriod: 90,
    breakdown: {
      active: 75,
      inactive: 15,
      pending: 5
    }
  }
};

// Mock data for monthly trends
const monthlyTrends = [
  { month: 'Jan', revenue: 18500, bookings: 185 },
  { month: 'Feb', revenue: 21000, bookings: 210 },
  { month: 'Mar', revenue: 24500, bookings: 245 },
  { month: 'Apr', revenue: 22000, bookings: 220 },
  { month: 'May', revenue: 25500, bookings: 255 },
  { month: 'Jun', revenue: 28000, bookings: 280 }
];

const AdminReportsPage = () => {
  const [dateRange, setDateRange] = useState('month');
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="mt-1 text-sm text-gray-500">
              Comprehensive insights and performance metrics
            </p>
          </div>
          
          <div className="flex space-x-4">
            <select
              className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="h-5 w-5 mr-2 text-gray-400" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Revenue Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-green-500 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              {analyticsData.revenue.growth}%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
          <p className="text-2xl font-bold">${analyticsData.revenue.total.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">
            vs. ${analyticsData.revenue.lastPeriod.toLocaleString()} last period
          </p>
        </motion.div>

        {/* Bookings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 rounded-full p-3">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-blue-500 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              {analyticsData.bookings.growth}%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Bookings</h3>
          <p className="text-2xl font-bold">{analyticsData.bookings.total.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">
            {analyticsData.bookings.completed} completed
          </p>
        </motion.div>

        {/* Customers Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 rounded-full p-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-purple-500 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              {analyticsData.customers.growth}%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Customers</h3>
          <p className="text-2xl font-bold">{analyticsData.customers.total.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">
            {analyticsData.customers.breakdown.active} active users
          </p>
        </motion.div>

        {/* Service Providers Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 rounded-full p-3">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-yellow-500 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              {analyticsData.providers.growth}%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Service Providers</h3>
          <p className="text-2xl font-bold">{analyticsData.providers.total}</p>
          <p className="text-sm text-gray-500 mt-2">
            {analyticsData.providers.breakdown.active} active pros
          </p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-medium mb-6">Revenue Trend</h3>
          <div className="h-64 relative">
            {/* Simple bar chart visualization */}
            <div className="flex h-48 items-end space-x-2 absolute bottom-0">
              {monthlyTrends.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${(data.revenue / 30000) * 100}%` }}
                  ></div>
                  <div className="text-xs mt-2">{data.month}</div>
                  <div className="text-xs font-medium">${(data.revenue / 1000).toFixed(1)}k</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bookings Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-medium mb-6">Bookings Trend</h3>
          <div className="h-64 relative">
            {/* Simple line chart visualization */}
            <div className="flex h-48 items-end space-x-2 absolute bottom-0">
              {monthlyTrends.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-green-500 rounded-t"
                    style={{ height: `${(data.bookings / 300) * 100}%` }}
                  ></div>
                  <div className="text-xs mt-2">{data.month}</div>
                  <div className="text-xs font-medium">{data.bookings}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium">Revenue Breakdown</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Standard Cleaning</span>
                </div>
                <div className="text-sm font-medium">
                  ${analyticsData.revenue.breakdown.standardCleaning.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Deep Cleaning</span>
                </div>
                <div className="text-sm font-medium">
                  ${analyticsData.revenue.breakdown.deepCleaning.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Move In/Out</span>
                </div>
                <div className="text-sm font-medium">
                  ${analyticsData.revenue.breakdown.moveInOut.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Airbnb</span>
                </div>
                <div className="text-sm font-medium">
                  ${analyticsData.revenue.breakdown.airbnb.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Booking Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium">Booking Status</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Completed</span>
                </div>
                <div className="text-sm font-medium">
                  {analyticsData.bookings.breakdown.completed.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm text-gray-600">Cancelled</span>
                </div>
                <div className="text-sm font-medium">
                  {analyticsData.bookings.breakdown.cancelled}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-600">No Show</span>
                </div>
                <div className="text-sm font-medium">
                  {analyticsData.bookings.breakdown.noShow}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-sm text-gray-600">Disputed</span>
                </div>
                <div className="text-sm font-medium">
                  {analyticsData.bookings.breakdown.disputed}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminReportsPage;