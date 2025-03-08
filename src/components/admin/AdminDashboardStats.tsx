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
  CheckCircle
} from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    totalCustomers: number;
    totalPros: number;
    activeBookings: number;
    completedBookings: number;
    revenue: number;
    averageRating: number;
    customerGrowth: number;
    proGrowth: number;
  };
}

const AdminDashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="bg-blue-100 rounded-full p-3">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <span className="text-green-500 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            {stats.customerGrowth}%
          </span>
        </div>
        <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
        <p className="text-2xl font-bold">{stats.totalCustomers + stats.totalPros}</p>
        <p className="text-sm text-gray-500 mt-2">
          {stats.totalCustomers} customers, {stats.totalPros} pros
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="bg-green-100 rounded-full p-3">
            <Calendar className="h-6 w-6 text-green-600" />
          </div>
          <span className="text-green-500 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {stats.activeBookings} active
          </span>
        </div>
        <h3 className="text-gray-500 text-sm font-medium">Total Bookings</h3>
        <p className="text-2xl font-bold">{stats.activeBookings + stats.completedBookings}</p>
        <p className="text-sm text-gray-500 mt-2">
          {stats.completedBookings} completed
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="bg-purple-100 rounded-full p-3">
            <DollarSign className="h-6 w-6 text-purple-600" />
          </div>
          <span className="text-green-500 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            15%
          </span>
        </div>
        <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
        <p className="text-2xl font-bold">${stats.revenue.toLocaleString()}</p>
        <p className="text-sm text-gray-500 mt-2">
          ${(stats.revenue * 0.85).toLocaleString()} last month
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="bg-yellow-100 rounded-full p-3">
            <Star className="h-6 w-6 text-yellow-600" />
          </div>
          <span className="text-green-500 flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            98% satisfaction
          </span>
        </div>
        <h3 className="text-gray-500 text-sm font-medium">Average Rating</h3>
        <p className="text-2xl font-bold">{stats.averageRating}</p>
        <p className="text-sm text-gray-500 mt-2">
          From {stats.completedBookings} reviews
        </p>
      </motion.div>
    </div>
  );
};

export default AdminDashboardStats;