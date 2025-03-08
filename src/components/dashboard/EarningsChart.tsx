import React from 'react';
import { motion } from 'framer-motion';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface EarningData {
  date: string;
  amount: number;
}

interface EarningsChartProps {
  data: EarningData[];
  period: 'week' | 'month' | 'year';
  onPeriodChange: (period: 'week' | 'month' | 'year') => void;
}

const EarningsChart: React.FC<EarningsChartProps> = ({
  data,
  period,
  onPeriodChange
}) => {
  const maxAmount = Math.max(...data.map(d => d.amount));
  const totalEarnings = data.reduce((sum, d) => sum + d.amount, 0);
  const averageEarnings = totalEarnings / data.length;

  const previousPeriodEarnings = data
    .slice(0, Math.floor(data.length / 2))
    .reduce((sum, d) => sum + d.amount, 0);
  const currentPeriodEarnings = data
    .slice(Math.floor(data.length / 2))
    .reduce((sum, d) => sum + d.amount, 0);
  const earningsChange = ((currentPeriodEarnings - previousPeriodEarnings) / previousPeriodEarnings) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Earnings Overview</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => onPeriodChange('week')}
              className={`px-3 py-1 rounded-full text-sm ${
                period === 'week'
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => onPeriodChange('month')}
              className={`px-3 py-1 rounded-full text-sm ${
                period === 'month'
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => onPeriodChange('year')}
              className={`px-3 py-1 rounded-full text-sm ${
                period === 'year'
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500">Total Earnings</div>
            <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500">Average per Day</div>
            <div className="text-2xl font-bold">${averageEarnings.toFixed(2)}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500">Growth</div>
            <div className="flex items-center">
              <span className="text-2xl font-bold">
                {Math.abs(earningsChange).toFixed(1)}%
              </span>
              {earningsChange >= 0 ? (
                <TrendingUp className="ml-2 h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="ml-2 h-5 w-5 text-red-500" />
              )}
            </div>
          </div>
        </div>

        <div className="relative h-64">
          <div className="absolute inset-0">
            <div className="flex h-full items-end space-x-2">
              {data.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex-1 bg-blue-600 rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.amount / maxAmount) * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 text-xs text-gray-500">
                    {format(new Date(item.date), 'MMM d')}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsChart;