import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  User,
  DollarSign,
  Edit,
  Trash2,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical
} from 'lucide-react';

// Mock data for bookings
const bookings = [
  {
    id: 1,
    customer: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567'
    },
    pro: {
      name: 'Maria Rodriguez',
      rating: 4.9
    },
    service: 'Standard Cleaning',
    date: '2025-06-15',
    time: '10:00 AM',
    address: '123 Main St, Apt 4B, New York, NY 10001',
    status: 'confirmed',
    amount: 120,
    duration: '3 hours',
    notes: 'Please pay extra attention to kitchen and bathrooms'
  },
  {
    id: 2,
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '(555) 234-5678'
    },
    pro: {
      name: 'David Wilson',
      rating: 4.8
    },
    service: 'Deep Cleaning',
    date: '2025-06-15',
    time: '2:00 PM',
    address: '456 Oak Ave, Suite 7, Brooklyn, NY 11201',
    status: 'pending',
    amount: 180,
    duration: '4 hours',
    notes: 'First time customer'
  },
  {
    id: 3,
    customer: {
      name: 'Michael Chen',
      email: 'mchen@example.com',
      phone: '(555) 345-6789'
    },
    pro: {
      name: 'Lisa Brown',
      rating: 4.7
    },
    service: 'Move-In Cleaning',
    date: '2025-06-16',
    time: '9:00 AM',
    address: '789 Pine St, Unit 12, Queens, NY 11101',
    status: 'in_progress',
    amount: 220,
    duration: '5 hours',
    notes: 'New apartment, needs thorough cleaning'
  }
];

const AdminBookingsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedService, setSelectedService] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [showDetails, setShowDetails] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.pro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;
    const matchesService = selectedService === 'all' || booking.service.toLowerCase().includes(selectedService.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesService;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage all cleaning service bookings.
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
                placeholder="Search bookings by customer, pro, or address..."
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
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    
                    <div className="px-4 py-2">
                      <label className="block text-sm font-medium text-gray-700">Service Type</label>
                      <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                      >
                        <option value="all">All Services</option>
                        <option value="standard">Standard Cleaning</option>
                        <option value="deep">Deep Cleaning</option>
                        <option value="move">Move In/Out Cleaning</option>
                        <option value="airbnb">Airbnb Cleaning</option>
                        <option value="office">Office Cleaning</option>
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
                        <option value="tomorrow">Tomorrow</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                      </select>
                    </div>
                    
                    <div className="px-4 py-2 flex justify-end">
                      <button
                        type="button"
                        className="text-sm text-gray-700 hover:text-gray-900"
                        onClick={() => {
                          setSelectedStatus('all');
                          setSelectedService('all');
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
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Booking
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pro
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <React.Fragment key={booking.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Calendar className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.service}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(booking.date).toLocaleDateString()} at {booking.time}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.customer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.pro.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Rating: {booking.pro.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      ${booking.amount}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => setShowDetails(showDetails === booking.id ? null : booking.id)}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded Details */}
                  {showDetails === booking.id && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Booking Details</h4>
                            <div className="space-y-2 text-sm text-gray-500">
                              <div className="flex items-start">
                                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                                <span>{booking.address}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                                <span>Duration: {booking.duration}</span>
                              </div>
                              <div className="flex items-start">
                                <AlertCircle className="h-5 w-5 text-gray-400 mr-2" />
                                <span>Notes: {booking.notes}</span>
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
                              <button
                                type="button"
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                Confirm
                              </button>
                              <button
                                type="button"
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                Cancel
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

export default AdminBookingsPage;