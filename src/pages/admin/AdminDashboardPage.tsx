import React, { useEffect, useState } from 'react';
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
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

// Add interface for bookings
interface Booking {
  id: string;
  user_id: string;
  service_type: string;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  amount: number;
  profiles: {
    email: string;
    full_name: string;
  };
}

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
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalPros: 0,
    activeBookings: 0,
    completedBookings: 0,
    revenue: 0,
    averageRating: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent bookings with user profiles
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            profiles:user_id (
              email,
              full_name
            )
          `)
          .order('scheduled_date', { ascending: false })
          .limit(5);

        if (bookingsError) throw bookingsError;
        setBookings(bookingsData || []);

        // Fetch statistics
        const { data: statsData, error: statsError } = await supabase
          .from('bookings')
          .select('status, amount');

        if (statsError) throw statsError;

        // Calculate statistics
        const stats = {
          totalCustomers: new Set(bookingsData?.map(b => b.user_id)).size,
          totalPros: 0, // You'll need to add this from your providers table
          activeBookings: statsData?.filter(b => b.status === 'pending').length || 0,
          completedBookings: statsData?.filter(b => b.status === 'completed').length || 0,
          revenue: statsData?.reduce((sum, booking) => sum + (booking.amount || 0), 0) || 0,
          averageRating: 4.8 // You'll need to add this from your reviews table
        };

        setStats(stats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

      {/* Recent Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-white rounded-lg shadow mb-8"
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    Loading bookings...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.profiles?.full_name || booking.profiles?.email || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.service_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.scheduled_date).toLocaleDateString()} {booking.scheduled_time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${booking.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link
                        to={`/admin/bookings/${booking.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
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