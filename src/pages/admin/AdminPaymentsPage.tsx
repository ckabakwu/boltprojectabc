import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  Filter,
  DollarSign,
  Calendar,
  ChevronDown,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  XCircle,
  MoreVertical,
  Download,
  User,
  Clock,
  AlertCircle
} from 'lucide-react';

// Mock data for transactions
const transactions = [
  {
    id: 1,
    type: 'payment',
    amount: 120,
    status: 'completed',
    date: '2025-06-15',
    customer: {
      name: 'John Smith',
      email: 'john.smith@example.com'
    },
    pro: {
      name: 'Maria Rodriguez',
      email: 'maria.r@example.com'
    },
    booking: {
      id: 'B1001',
      service: 'Standard Cleaning',
      date: '2025-06-15',
      time: '10:00 AM'
    },
    paymentMethod: 'Visa •••• 4242',
    transactionId: 'txn_1234567890',
    platformFee: 24,
    proEarnings: 96
  },
  {
    id: 2,
    type: 'refund',
    amount: 180,
    status: 'pending',
    date: '2025-06-14',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com'
    },
    pro: {
      name: 'David Wilson',
      email: 'david.w@example.com'
    },
    booking: {
      id: 'B1002',
      service: 'Deep Cleaning',
      date: '2025-06-14',
      time: '2:00 PM'
    },
    paymentMethod: 'Mastercard •••• 5555',
    transactionId: 'txn_0987654321',
    refundReason: 'Service not completed as expected',
    platformFee: 36,
    proEarnings: 144
  },
  {
    id: 3,
    type: 'payout',
    amount: 850,
    status: 'completed',
    date: '2025-06-13',
    pro: {
      name: 'Maria Rodriguez',
      email: 'maria.r@example.com'
    },
    payoutMethod: 'Direct Deposit',
    payoutPeriod: 'June 1-15, 2025',
    transactionId: 'pyt_1234567890'
  }
];

const AdminPaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [showDetails, setShowDetails] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
      case 'refund':
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case 'payout':
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      default:
        return <DollarSign className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      (transaction.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (transaction.pro?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments & Refunds</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage transactions, process refunds, and handle payouts.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="bg-green-100 rounded-full p-3">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-green-500 flex items-center text-sm">+12.5%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Monthly Revenue</h3>
          <p className="text-2xl font-bold">$25,680</p>
          <p className="text-sm text-gray-500 mt-2">vs. $22,830 last month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-100 rounded-full p-3">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-blue-500 flex items-center text-sm">156 total</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Pending Payouts</h3>
          <p className="text-2xl font-bold">$12,450</p>
          <p className="text-sm text-gray-500 mt-2">To be processed this week</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="bg-red-100 rounded-full p-3">
              <ArrowUpRight className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-red-500 flex items-center text-sm">8 pending</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Refund Requests</h3>
          <p className="text-2xl font-bold">$1,280</p>
          <p className="text-sm text-gray-500 mt-2">Requires review</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="bg-purple-100 rounded-full p-3">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-purple-500 flex items-center text-sm">98.5%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Success Rate</h3>
          <p className="text-2xl font-bold">2,450</p>
          <p className="text-sm text-gray-500 mt-2">Successful transactions</p>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by customer, pro, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter className="h-5 w-5 mr-2 text-gray-400" />
                Filters
                <ChevronDown className="ml-2 h-5 w-5 text-gray-400" />
              </button>
              
              {filterOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    <div className="px-4 py-2">
                      <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
                      <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                      >
                        <option value="all">All Types</option>
                        <option value="payment">Payments</option>
                        <option value="refund">Refunds</option>
                        <option value="payout">Payouts</option>
                      </select>
                    </div>
                    
                    <div className="px-4 py-2">
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                    
                    <div className="px-4 py-2">
                      <label className="block text-sm font-medium text-gray-700">Date Range</label>
                      <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={selectedDateRange}
                        onChange={(e) => setSelectedDateRange(e.target.value)}
                      >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                      </select>
                    </div>
                    
                    <div className="px-4 py-2 flex justify-end">
                      <button
                        type="button"
                        className="text-sm text-gray-700 hover:text-gray-900"
                        onClick={() => {
                          setSelectedType('all');
                          setSelectedStatus('all');
                          setSelectedDateRange('all');
                        }}
                      >
                        Reset Filters
                      </button>
                    </div>
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

      {/* Transactions Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parties
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <React.Fragment key={transaction.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.transactionId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${transaction.amount}
                      </div>
                      {transaction.type === 'payment' && (
                        <div className="text-xs text-gray-500">
                          Fee: ${transaction.platformFee}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transaction.type === 'payout' ? (
                          <span>To: {transaction.pro.name}</span>
                        ) : (
                          <span>
                            {transaction.customer.name} → {transaction.pro.name}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.booking?.service}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => setShowDetails(showDetails === transaction.id ? null : transaction.id)}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded Details */}
                  {showDetails === transaction.id && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Transaction Details</h4>
                            <div className="space-y-2 text-sm text-gray-500">
                              {transaction.type !== 'payout' && (
                                <>
                                  <div className="flex items-center">
                                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                                    <span>
                                      Booking: {new Date(transaction.booking.date).toLocaleDateString()} at {transaction.booking.time}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                                    <span>Payment Method: {transaction.paymentMethod}</span>
                                  </div>
                                </>
                              )}
                              {transaction.type === 'payout' && (
                                <>
                                  <div className="flex items-center">
                                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                                    <span>Period: {transaction.payoutPeriod}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                                    <span>Payout Method: {transaction.payoutMethod}</span>
                                  </div>
                                </>
                              )}
                              {transaction.type === 'refund' && (
                                <div className="flex items-start">
                                  <AlertCircle className="h-5 w-5 text-gray-400 mr-2" />
                                  <span>Reason: {transaction.refundReason}</span>
                                </div>
                              )}
                              <div className="flex items-center">
                                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                                <span>
                                  Processed: {new Date(transaction.date).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Actions</h4>
                            <div className="space-x-3">
                              {transaction.status === 'pending' && (
                                <>
                                  <button
                                    type="button"
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                    Approve
                                  </button>
                                  <button
                                    type="button"
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  >
                                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                    Reject
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download Receipt
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                  <span className="font-medium">97</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    Previous
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    3
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentsPage;