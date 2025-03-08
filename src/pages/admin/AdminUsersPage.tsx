import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  Filter,
  User,
  Mail,
  Phone,
  Star,
  Calendar,
  DollarSign,
  Shield,
  CheckCircle,
  XCircle,
  MoreVertical,
  Edit,
  Trash2,
  ChevronDown,
  MapPin,
  Clock
} from 'lucide-react';

// Mock data for users
const users = [
  {
    id: 1,
    type: 'customer',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    status: 'active',
    joinDate: '2025-01-15',
    bookings: 12,
    totalSpent: 1440,
    rating: 4.8,
    address: '123 Main St, Apt 4B, New York, NY 10001',
    lastBooking: '2025-06-10'
  },
  {
    id: 2,
    type: 'pro',
    name: 'Maria Rodriguez',
    email: 'maria.r@example.com',
    phone: '(555) 234-5678',
    status: 'active',
    joinDate: '2025-02-01',
    completedJobs: 85,
    earnings: 6800,
    rating: 4.9,
    backgroundCheck: 'verified',
    address: '456 Oak Ave, Brooklyn, NY 11201',
    lastActive: '2025-06-15'
  },
  {
    id: 3,
    type: 'customer',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 345-6789',
    status: 'inactive',
    joinDate: '2025-03-10',
    bookings: 3,
    totalSpent: 360,
    rating: 4.5,
    address: '789 Pine St, Queens, NY 11101',
    lastBooking: '2025-05-20'
  },
  {
    id: 4,
    type: 'pro',
    name: 'David Wilson',
    email: 'david.w@example.com',
    phone: '(555) 456-7890',
    status: 'pending',
    joinDate: '2025-06-01',
    completedJobs: 0,
    earnings: 0,
    rating: 0,
    backgroundCheck: 'pending',
    address: '321 Elm St, Bronx, NY 10451',
    lastActive: '2025-06-14'
  }
];

const AdminUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDetails, setShowDetails] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBackgroundCheckColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || user.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage customers and service providers.
        </p>
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
                placeholder="Search users by name, email, or phone..."
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
                      <label className="block text-sm font-medium text-gray-700">User Type</label>
                      <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                      >
                        <option value="all">All Users</option>
                        <option value="customer">Customers</option>
                        <option value="pro">Service Providers</option>
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
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                    
                    <div className="px-4 py-2 flex justify-end">
                      <button
                        type="button"
                        className="text-sm text-gray-700 hover:text-gray-900"
                        onClick={() => {
                          setSelectedType('all');
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
            >
              Add New User
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <React.Fragment key={user.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.type === 'pro' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.type === 'pro' ? 'Service Provider' : 'Customer'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-900">{user.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.type === 'customer' ? (
                        <div>
                          {user.bookings} bookings
                          <br />
                          ${user.totalSpent} spent
                        </div>
                      ) : (
                        <div>
                          {user.completedJobs} jobs
                          <br />
                          ${user.earnings} earned
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => setShowDetails(showDetails === user.id ? null : user.id)}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded Details */}
                  {showDetails === user.id && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">User Details</h4>
                            <div className="space-y-2 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                                <span>{user.phone}</span>
                              </div>
                              <div className="flex items-start">
                                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                                <span>{user.address}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                                <span>Joined: {new Date(user.joinDate).toLocaleDateString()}</span>
                              </div>
                              {user.type === 'pro' && (
                                <div className="flex items-center">
                                  <Shield className="h-5 w-5 text-gray-400 mr-2" />
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBackgroundCheckColor(user.backgroundCheck)}`}>
                                    Background Check: {user.backgroundCheck.charAt(0).toUpperCase() + user.backgroundCheck.slice(1)}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center">
                                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                                <span>
                                  Last {user.type === 'customer' ? 'Booking' : 'Active'}: {
                                    user.type === 'customer' ? 
                                    new Date(user.lastBooking).toLocaleDateString() :
                                    new Date(user.lastActive).toLocaleDateString()
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Actions</h4>
                            <div className="space-x-3">
                              <button
                                type="button"
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </button>
                              {user.status === 'active' ? (
                                <button
                                  type="button"
                                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                  Suspend
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                  Activate
                                </button>
                              )}
                              <button
                                type="button"
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                                Delete
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

export default AdminUsersPage;