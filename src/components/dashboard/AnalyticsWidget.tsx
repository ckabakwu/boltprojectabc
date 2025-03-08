import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Star, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

interface AnalyticsWidgetProps {
  stats: {
    totalEarnings: number;
    previousEarnings: number;
    averageRating: number;
    totalJobs: number;
    completionRate: number;
  };
}

const AnalyticsWidget: React.FC<AnalyticsWidgetProps> = ({ stats }) => {
  const calculateGrowth = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  const earningsGrowth = calculateGrowth(stats.totalEarnings, stats.previousEarnings);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="bg-green-100 rounded-full p-3">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <span className={`flex items-center ${earningsGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {earningsGrowth >= 0 ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {Math.abs(earningsGrowth).toFixed(1)}%
          </span>
        </div>
        <h3 className="text-gray-500 text-sm font-medium">Total Earnings</h3>
        <p className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</p>
        <p className="text-sm text-gray-500 mt-2">
          vs. ${stats.previousEarnings.toLocaleString()} last month
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="bg-yellow-100 rounded-full p-3">
            <Star className="h-6 w-6 text-yellow-600" />
          </div>
          <span className="text-yellow-500 flex items-center">
            <Star className="h-4 w-4 mr-1 fill-current" />
            {stats.averageRating}
          </span>
        </div>
        <h3 className="text-gray-500 text-sm font-medium">Average Rating</h3>
        <p className="text-2xl font-bold">{stats.averageRating}/5.0</p>
        <p className="text-sm text-gray-500 mt-2">
          Based on {stats.totalJobs} reviews
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="bg-blue-100 rounded-full p-3">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <span className="text-blue-500 flex items-center">
            {stats.totalJobs} total
          </span>
        </div>
        <h3 className="text-gray-500 text-sm font-medium">Completed Jobs</h3>
        <p className="text-2xl font-bold">{stats.totalJobs}</p>
        <p className="text-sm text-gray-500 mt-2">
          {Math.round(stats.completionRate * 100)}% completion rate
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="bg-purple-100 rounded-full p-3">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <span className="text-purple-500 flex items-center">
            Last 30 days
          </span>
        </div>
        <h3 className="text-gray-500 text-sm font-medium">Growth Rate</h3>
        <p className="text-2xl font-bold">+{earningsGrowth.toFixed(1)}%</p>
        <p className="text-sm text-gray-500 mt-2">
          Month over month
        </p>
      </motion.div>
    </div>
  );
};

export default AnalyticsWidget;