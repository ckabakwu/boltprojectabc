import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Tag,
  Plus,
  Calendar,
  DollarSign,
  Users,
  Percent,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ChevronDown,
  Clock,
  AlertCircle
} from 'lucide-react';

// Mock data for promotions
const promotions = [
  {
    id: 1,
    code: 'SUMMER25',
    type: 'percentage',
    value: 25,
    description: 'Summer cleaning discount',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    status: 'active',
    usageLimit: 1000,
    usageCount: 245,
    minBookingValue: 100,
    restrictions: ['Standard Cleaning', 'Deep Cleaning'],
    userType: 'new',
    createdAt: '2025-05-15'
  },
  {
    id: 2,
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    description: 'New customer discount',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    status: 'active',
    usageLimit: null,
    usageCount: 876,
    minBookingValue: 50,
    restrictions: ['All Services'],
    userType: 'new',
    createdAt: '2025-01-01'
  },
  {
    id: 3,
    code: 'FLASH50',
    type: 'fixed',
    value: 50,
    description: 'Flash sale discount',
    startDate: '2025-06-15',
    endDate: '2025-06-17',
    status: 'scheduled',
    usageLimit: 500,
    usageCount: 0,
    minBookingValue: 150,
    restrictions: ['Deep Cleaning', 'Move-In/Out Cleaning'],
    userType: 'all',
    createdAt: '2025-06-10'
  }
];

const AdminPromotionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showNewPromotion, setShowNewPromotion] = useState(false);
  const [showDetails, setShowDetails] = useState<number | null>(null);

  // Form state for new promotion
  const [newPromotion, setNewPromotion] = useState({
    code: '',
    type: 'percentage',
    value: '',
    description: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    minBookingValue: '',
    restrictions: [] as string[],
    userType: 'all'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreatePromotion = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would create the promotion in the backend
    console.log('Creating promotion:', newPromotion);
    setShowNewPromotion(false);
  };

  const filteredPromotions = promotions.filter(promo => {
    const matchesSearch = 
      promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || promo.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Promotions Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create and manage promotional campaigns and discount codes.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="bg-green-100 rounded-full p-3">
              <Tag className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-green-500 text-sm">3 active</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Active Promotions</h3>
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm text-gray-500 mt-2">5 ending this month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-100 rounded-full p-3">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-blue-500 text-sm">This month</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Discount Value</h3>
          <p className="text-2xl font-bold">$12,450</p>
          <p className="text-sm text-gray-500 mt-2">1,245 redemptions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="bg-purple-100 rounded-full p-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-purple-500 text-sm">+15%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">New Customers</h3>
          <p className="text-2xl font-bold">256</p>
          <p className="text-sm text-gray-500 mt-2">via promotions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="bg-yellow-100 rounded-full p-3">
              <Percent className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-yellow-500 text-sm">24.5%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Conversion Rate</h3>
          <p className="text-2xl font-bold">25.4%</p>
          <p className="text-sm text-gray-500 mt-2">+5.2% from last month</p>
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
                placeholder="Search promotions by code or description..."
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
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="expired">Expired</option>
                        <option value="paused">Paused</option>
                      </select>
                    </div>
                    
                    <div className="px-4 py-2 flex justify-end">
                      <button
                        type="button"
                        className="text-sm text-gray-700 hover:text-gray-900"
                        onClick={() => {
                          setSelectedStatus('all');
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
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setShowNewPromotion(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Promotion
            </button>
          </div>
        </div>
      </div>

      {/* New Promotion Form */}
      {showNewPromotion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow rounded-lg mb-6"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Create New Promotion</h2>
          </div>
          <form onSubmit={handleCreatePromotion} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Promo Code
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={newPromotion.code}
                  onChange={(e) => setNewPromotion({...newPromotion, code: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Discount Type
                </label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={newPromotion.type}
                  onChange={(e) => setNewPromotion({...newPromotion, type: e.target.value})}
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {newPromotion.type === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {newPromotion.type === 'percentage' ? (
                      <Percent className="h-5 w-5 text-gray-400" />
                    ) : (
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="number"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                    value={newPromotion.value}
                    onChange={(e) => setNewPromotion({...newPromotion, value: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Minimum Booking Value
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                    value={newPromotion.minBookingValue}
                    onChange={(e) => setNewPromotion({...newPromotion, minBookingValue: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={newPromotion.startDate}
                  onChange={(e) => setNewPromotion({...newPromotion, startDate: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={newPromotion.endDate}
                  onChange={(e) => setNewPromotion({...newPromotion, endDate: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Usage Limit
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={newPromotion.usageLimit}
                  onChange={(e) => setNewPromotion({...newPromotion, usageLimit: e.target.value})}
                  placeholder="Leave empty for unlimited"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  User Type
                </label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={newPromotion.userType}
                  onChange={(e) => setNewPromotion({...newPromotion, userType: e.target.value})}
                >
                  <option value="all">All Users</option>
                  <option value="new">New Customers Only</option>
                  <option value="existing">Existing Customers Only</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  rows={3}
                  value={newPromotion.description}
                  onChange={(e) => setNewPromotion({...newPromotion, description: e.target.value})}
                  required
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowNewPromotion(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Promotion
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Promotions List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promotion
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPromotions.map((promotion) => (
                <React.Fragment key={promotion.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Tag className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {promotion.code}
                          </div>
                          <div className="text-sm text-gray-500">
                            {promotion.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {promotion.type === 'percentage' ? (
                          <span>{promotion.value}% off</span>
                        ) : (
                          <span>${promotion.value} off</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        Min. booking: ${promotion.minBookingValue}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(promotion.startDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        to {new Date(promotion.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {promotion.usageCount} used
                      </div>
                      <div className="text-sm text-gray-500">
                        {promotion.usageLimit ? `${promotion.usageLimit} limit` : 'No limit'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(promotion.status)}`}>
                        {promotion.status.charAt(0).toUpperCase() + promotion.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
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

export default AdminPromotionsPage;