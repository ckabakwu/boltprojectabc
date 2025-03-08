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
  DollarSign,
  Download,
  CreditCard,
  Sliders,
  MessageSquare,
  CheckCircle,
  TrendingUp,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Mock data for earnings
const earningsData = [
  {
    id: 1,
    date: '2025-06-15',
    client: 'John Smith',
    service: 'Standard Cleaning',
    amount: 85,
    status: 'Paid',
    paymentMethod: 'Direct Deposit'
  },
  {
    id: 2,
    date: '2025-06-10',
    client: 'Sarah Johnson',
    service: 'Deep Cleaning',
    amount: 120,
    status: 'Paid',
    paymentMethod: 'Direct Deposit'
  },
  {
    id: 3,
    date: '2025-06-05',
    client: 'Michael Chen',
    service: 'Standard Cleaning',
    amount: 85,
    status: 'Paid',
    paymentMethod: 'Direct Deposit'
  },
  {
    id: 4,
    date: '2025-06-01',
    client: 'Jessica Williams',
    service: 'Move In/Out Cleaning',
    amount: 150,
    status: 'Paid',
    paymentMethod: 'Direct Deposit'
  },
  {
    id: 5,
    date: '2025-05-25',
    client: 'David Rodriguez',
    service: 'Standard Cleaning',
    amount: 85,
    status: 'Paid',
    paymentMethod: 'Direct Deposit'
  }
];

// Monthly earnings data for chart
const monthlyEarnings = [
  { month: 'Jan', amount: 980 },
  { month: 'Feb', amount: 1120 },
  { month: 'Mar', amount: 1340 },
  { month: 'Apr', amount: 1050 },
  { month: 'May', amount: 1280 },
  { month: 'Jun', amount: 1240 }
];

const ProEarningsPage = () => {
  const [dateRange, setDateRange] = useState('month');
  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState('bank');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const calculateTotalEarnings = () => {
    return earningsData.reduce((total, earning) => total + earning.amount, 0);
  };
  
  const handleSubmitPayoutMethod = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the payout method to the backend
    setShowPayoutForm(false);
  };

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
                      <h3 className="font-semibold">Maria Rodriguez</h3>
                      <p className="text-sm text-gray-500">Professional Cleaner</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <nav className="space-y-1">
                    <Link to="/pro-dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                      <Home className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link to="/available-jobs" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                      <Calendar className="w-5 h-5" />
                      <span>Available Jobs</span>
                    </Link>
                    <Link to="/my-jobs" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                      <CheckCircle className="w-5 h-5" />
                      <span>My Jobs</span>
                    </Link>
                    <Link to="/earnings" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-700">
                      <DollarSign className="w-5 h-5" />
                      <span>Earnings</span>
                    </Link>
                    <Link to="/messages" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                      <MessageSquare className="w-5 h-5" />
                      <span>Messages</span>
                    </Link>
                    <Link to="/availability" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                      <Sliders className="w-5 h-5" />
                      <span>Availability</span>
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
            </div>
            
            {/* Main Content */}
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Earnings</h1>
                <div className="flex space-x-3">
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                    <option value="all">All Time</option>
                  </select>
                  <button className="btn btn-secondary flex items-center">
                    <Download className="mr-2" size={18} />
                    Export
                  </button>
                </div>
              </div>
              
              {/* Earnings Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
                    <DollarSign className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold">${calculateTotalEarnings()}</p>
                  <p className="text-sm text-green-600 mt-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12% from last month
                  </p>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Jobs Completed</h3>
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold">{earningsData.length}</p>
                  <p className="text-sm text-blue-600 mt-2">
                    Average: ${(calculateTotalEarnings() / earningsData.length).toFixed(2)}/job
                  </p>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Next Payout</h3>
                    <CreditCard className="h-5 w-5 text-purple-500" />
                  </div>
                  <p className="text-3xl font-bold">Jun 30</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Estimated: ${calculateTotalEarnings()}
                  </p>
                </div>
              </div>
              
              {/* Earnings Chart */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Earnings Trend</h2>
                </div>
                <div className="p-6">
                  <div className="h-64 relative">
                    {/* Simple bar chart visualization */}
                    <div className="flex h-48 items-end space-x-2 absolute bottom-0">
                      {monthlyEarnings.map((data, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div 
                            className="w-12 bg-blue-500 rounded-t"
                            style={{ height: `${(data.amount / 1500) * 100}%` }}
                          ></div>
                          <div className="text-xs mt-2">{data.month}</div>
                          <div className="text-xs font-medium">${data.amount}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payout Method */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Payout Method</h2>
                </div>
                {!showPayoutForm ? (
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                          <CreditCard className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Direct Deposit</p>
                          <p className="text-sm text-gray-500">Bank of America ••••6789</p>
                        </div>
                      </div>
                      <button 
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        onClick={() => setShowPayoutForm(true)}
                      >
                        Change
                      </button>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Payments are processed every two weeks. Your next payout is scheduled for June 30, 2025.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <form onSubmit={handleSubmitPayoutMethod}>
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payout Method
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <div
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              payoutMethod === 'bank' 
                                ? 'border-blue-600 bg-blue-50' 
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                            onClick={() => setPayoutMethod('bank')}
                          >
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                payoutMethod === 'bank' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                              }`}>
                                {payoutMethod === 'bank' && (
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                  </svg>
                                )}
                              </div>
                              <span className="font-medium">Bank Account</span>
                            </div>
                          </div>
                          
                          <div
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              payoutMethod === 'paypal' 
                                ? 'border-blue-600 bg-blue-50' 
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                            onClick={() => setPayoutMethod('paypal')}
                          >
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                payoutMethod === 'paypal' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                              }`}>
                                {payoutMethod === 'paypal' && (
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                  </svg>
                                )}
                              </div>
                              <span className="font-medium">PayPal</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {payoutMethod === 'bank' ? (
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
                              Account Holder Name
                            </label>
                            <input
                              type="text"
                              id="accountName"
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              value={accountName}
                              onChange={(e) => setAccountName(e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                              Account Number
                            </label>
                            <input
                              type="text"
                              id="accountNumber"
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              value={accountNumber}
                              onChange={(e) => setAccountNumber(e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="routingNumber" className="block text-sm font-medium text-gray-700 mb-1">
                              Routing Number
                            </label>
                            <input
                              type="text"
                              id="routingNumber"
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              value={routingNumber}
                              onChange={(e) => setRoutingNumber(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label htmlFor="paypalEmail" className="block text-sm font-medium text-gray-700 mb-1">
                            PayPal Email
                          </label>
                          <input
                            type="email"
                            id="paypalEmail"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={paypalEmail}
                            onChange={(e) => setPaypalEmail(e.target.value)}
                            required
                          />
                        </div>
                      )}
                      
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => setShowPayoutForm(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
              
              {/* Earnings History */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Earnings History</h2>
                  <button className="text-sm text-gray-500 flex items-center">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {earningsData.map((earning) => (
                        <tr key={earning.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(earning.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {earning.client}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {earning.service}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${earning.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {earning.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {earningsData.length} of {earningsData.length} results
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
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProEarningsPage;