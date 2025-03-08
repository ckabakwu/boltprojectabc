import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users,
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  Tag,
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for dashboard statistics
const stats = {
  totalCustomers: 1250,
  totalPros: 85,
  activeBookings: 42,
  completedBookings: 156,
  revenue: 25680,
  averageRating: 4.8,
  customerGrowth: 15,
  proGrowth: 8
};

// Mock data for recent bookings
const recentBookings = [
  {
    id: 1,
    customer: 'John Smith',
    service: 'Standard Cleaning',
    date: '2025-06-15',
    time: '10:00 AM',
    status: 'confirmed',
    amount: 120
  },
  {
    id: 2,
    customer: 'Sarah Johnson',
    service: 'Deep Cleaning',
    date: '2025-06-15',
    time: '2:00 PM',
    status: 'pending',
    amount: 180
  },
  {
    id: 3,
    customer: 'Michael Chen',
    service: 'Move-In Cleaning',
    date: '2025-06-16',
    time: '9:00 AM',
    status: 'confirmed',
    amount: 220
  }
];

// Mock data for alerts
const alerts = [
  {
    id: 1,
    type: 'warning',
    message: '3 cleaners have incomplete background checks',
    time: '1 hour ago'
  },
  {
    id: 2,
    type: 'info',
    message: 'New promotion campaign starting tomorrow',
    time: '2 hours ago'
  },
  {
    id: 3,
    type: 'error',
    message: '5 customer complaints need attention',
    time: '3 hours ago'
  }
];

const AdminDashboardPage = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 rounded-full p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-green-500 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              {stats.customerGrowth}%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Customers</h3>
          <p className="text-2xl font-bold">{stats.totalCustomers}</p>
          <p className="text-sm text-gray-500 mt-2">
            {stats.totalPros} active service providers
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-green-500 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              24%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Active Bookings</h3>
          <p className="text-2xl font-bold">{stats.activeBookings}</p>
          <p className="text-sm text-gray-500 mt-2">
            {stats.completedBookings} completed this month
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 rounded-full p-3">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-red-500 flex items-center">
              <TrendingDown className="h-4 w-4 mr-1" />
              3%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Monthly Revenue</h3>
          <p className="text-2xl font-bold">${stats.revenue}</p>
          <p className="text-sm text-gray-500 mt-2">
            $21,430 last month
          </p>
        </motion.div>

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
            <span className="text-green-500 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              5%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Average Rating</h3>
          <p className="text-2xl font-bold">{stats.averageRating}</p>
          <p className="text-sm text-gray-500 mt-2">
            Based on 1,250 reviews
          </p>
        </motion.div>
      </div>

      {/* Recent Activity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium">Recent Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date/Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.date).toLocaleDateString()} {booking.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${booking.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* System Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium">System Alerts</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg flex items-start ${
                    alert.type === 'warning'
                      ? 'bg-yellow-50'
                      : alert.type === 'error'
                      ? 'bg-red-50'
                      : 'bg-blue-50'
                  }`}
                >
                  <AlertCircle className={`h-5 w-5 mr-3 ${
                    alert.type === 'warning'
                      ? 'text-yellow-600'
                      : alert.type === 'error'
                      ? 'text-red-600'
                      : 'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      alert.type === 'warning'
                        ? 'text-yellow-800'
                        : alert.type === 'error'
                        ? 'text-red-800'
                        : 'text-blue-800'
                    }`}>
                      {alert.message}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-6 w-6 text-blue-600 mb-2" />
            <span className="block text-sm font-medium">Add New Pro</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="h-6 w-6 text-green-600 mb-2" />
            <span className="block text-sm font-medium">Create Booking</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Tag className="h-6 w-6 text-purple-600 mb-2" />
            <span className="block text-sm font-medium">New Promotion</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Clock className="h-6 w-6 text-orange-600 mb-2" />
            <span className="block text-sm font-medium">View Schedule</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;