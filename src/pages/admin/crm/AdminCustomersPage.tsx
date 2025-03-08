import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  User,
  Calendar,
  DollarSign,
  Star,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for customers
const mockCustomers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Apt 4B',
    joinDate: '2025-01-15',
    totalBookings: 12,
    totalSpent: 1440,
    lastBooking: '2025-03-10',
    rating: 4.8,
    status: 'active',
    preferences: {
      service: 'Standard Cleaning',
      frequency: 'Bi-weekly',
      notes: 'Allergic to strong chemicals'
    }
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 234-5678',
    address: '456 Oak Ave, Suite 7',
    joinDate: '2025-02-01',
    totalBookings: 3,
    totalSpent: 360,
    lastBooking: '2025-03-05',
    rating: 4.5,
    status: 'active',
    preferences: {
      service: 'Deep Cleaning',
      frequency: 'Monthly',
      notes: 'Has pets - 2 cats'
    }
  }
];

const AdminCustomersPage = () => {
  const [customers] = useState(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const handleSendEmail = (email: string) => {
    // Implement email sending
    console.log('Send email to:', email);
  };

  const handleScheduleCall = (phone: string) => {
    // Implement call scheduling
    console.log('Schedule call with:', phone);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customer Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage customer information, preferences, and history.
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
                placeholder="Search by name, email, or phone..."
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
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setSelectedStatus('all')}
                    >
                      All Customers
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setSelectedStatus('active')}
                    >
                      Active
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setSelectedStatus('inactive')}
                    >
                      Inactive
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {customers.map((customer) => (
            <div key={customer.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {customer.name}
                    </h3>
                    <div className="mt-1 text-sm text-gray-500">
                      Customer since {new Date(customer.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleSendEmail(customer.email)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </button>
                  <button
                    onClick={() => handleScheduleCall(customer.phone)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </button>
                  <button className="text-gray-400 hover:text-gray-500">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {customer.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {customer.address}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Customer Stats</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center text-sm font-medium text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        Bookings
                      </div>
                      <div className="mt-1 text-2xl font-semibold text-gray-900">
                        {customer.totalBookings}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center text-sm font-medium text-gray-500">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Total Spent
                      </div>
                      <div className="mt-1 text-2xl font-semibold text-gray-900">
                        ${customer.totalSpent}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center text-sm font-medium text-gray-500">
                        <Star className="h-4 w-4 mr-2" />
                        Rating
                      </div>
                      <div className="mt-1 text-2xl font-semibold text-gray-900">
                        {customer.rating}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center text-sm font-medium text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        Last Booking
                      </div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        {new Date(customer.lastBooking).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Preferences</h4>
                <div className="text-sm text-gray-500">
                  <div>Preferred Service: {customer.preferences.service}</div>
                  <div>Frequency: {customer.preferences.frequency}</div>
                  <div>Notes: {customer.preferences.notes}</div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Link
                  to={`/admin/customers/${customer.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                >
                  View Full Profile
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCustomersPage;