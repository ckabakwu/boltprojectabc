import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  CreditCard, 
  Clock, 
  Download,
  Filter,
  ChevronDown,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle
} from 'lucide-react';

// Mock data for transactions
const transactions = [
  {
    id: 1,
    type: 'payment',
    amount: 120,
    date: '2025-06-15',
    description: 'Standard Cleaning Service',
    status: 'completed',
    paymentMethod: 'Visa •••• 4242'
  },
  {
    id: 2,
    type: 'refund',
    amount: 85,
    date: '2025-06-10',
    description: 'Cancelled Booking Refund',
    status: 'completed',
    paymentMethod: 'Original Payment Method'
  }
];

const PaymentsPage = () => {
  const [dateRange, setDateRange] = useState('month');
  const [filterOpen, setFilterOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="mt-1 text-sm text-gray-500">
          View your payment history and manage payment methods.
        </p>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-100 rounded-full p-3">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">This Month</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Spent</h3>
          <p className="text-2xl font-bold">$480</p>
          <p className="text-sm text-gray-500 mt-2">4 cleanings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="bg-green-100 rounded-full p-3">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Active</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Payment Method</h3>
          <p className="text-lg font-medium">Visa •••• 4242</p>
          <p className="text-sm text-gray-500 mt-2">Expires 12/25</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="bg-purple-100 rounded-full p-3">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Upcoming</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Next Payment</h3>
          <p className="text-lg font-medium">$120</p>
          <p className="text-sm text-gray-500 mt-2">Due Jun 15</p>
        </motion.div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
            <div className="flex space-x-3">
              <div className="relative">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <Filter className="h-5 w-5 mr-2 text-gray-400" />
                  {dateRange === 'month' ? 'This Month' : 
                   dateRange === 'year' ? 'This Year' : 
                   dateRange === 'all' ? 'All Time' : 'Custom Range'}
                  <ChevronDown className="ml-2 h-5 w-5 text-gray-400" />
                </button>
                
                {filterOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setDateRange('month');
                          setFilterOpen(false);
                        }}
                      >
                        This Month
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setDateRange('year');
                          setFilterOpen(false);
                        }}
                      >
                        This Year
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setDateRange('all');
                          setFilterOpen(false);
                        }}
                      >
                        All Time
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="h-5 w-5 mr-2 text-gray-400" />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {transaction.type === 'payment' ? (
                        <ArrowUpRight className="h-5 w-5 text-red-500 mr-2" />
                      ) : (
                        <ArrowDownLeft className="h-5 w-5 text-green-500 mr-2" />
                      )}
                      <span className="text-sm text-gray-900">{transaction.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${transaction.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.paymentMethod}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {transactions.length} transactions
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Payment Methods</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-gray-100 p-3 rounded-lg mr-4">
                <CreditCard className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-gray-500">Expires 12/25</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                Default
              </span>
              <button className="text-gray-400 hover:text-gray-500">
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <CreditCard className="h-5 w-5 mr-2 text-gray-400" />
            Add Payment Method
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;