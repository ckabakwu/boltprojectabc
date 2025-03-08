import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  MapPin, 
  Mail,
  Phone,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for incomplete bookings
const mockBookings = [
  {
    id: '1',
    customer: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567'
    },
    service: 'Standard Cleaning',
    date: '2025-03-15',
    time: '10:00',
    address: '123 Main St, Apt 4B',
    abandonedAt: 'payment',
    lastActivity: '2025-03-14T15:30:00Z',
    cart: {
      subtotal: 120,
      extras: ['Inside Fridge', 'Oven Cleaning']
    }
  },
  {
    id: '2',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '(555) 234-5678'
    },
    service: 'Deep Cleaning',
    date: '2025-03-16',
    time: '14:00',
    address: '456 Oak Ave, Suite 7',
    abandonedAt: 'service-selection',
    lastActivity: '2025-03-14T18:45:00Z',
    cart: {
      subtotal: 180,
      extras: []
    }
  }
];

const AdminIncompleteBookingsPage = () => {
  const [bookings] = useState(mockBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState('all');

  const handleRecoveryEmail = (booking: typeof mockBookings[0]) => {
    // Implement recovery email sending
    console.log('Send recovery email to:', booking.customer.email);
  };

  const handleFollowUpCall = (booking: typeof mockBookings[0]) => {
    // Implement follow-up call functionality
    console.log('Schedule follow-up call with:', booking.customer.phone);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Incomplete Bookings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and recover abandoned bookings at various stages of the process.
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
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter className="h-5 w-5 mr-2 text-gray-400" />
              Filter
            </button>
            
            {filterOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1 px-3">
                  <div className="mb-3">
                    <label htmlFor="stage-filter" className="block text-sm font-medium text-gray-700">
                      Abandoned Stage
                    </label>
                    <select
                      id="stage-filter"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={selectedStage}
                      onChange={(e) => setSelectedStage(e.target.value)}
                    >
                      <option value="all">All Stages</option>
                      <option value="service-selection">Service Selection</option>
                      <option value="scheduling">Scheduling</option>
                      <option value="payment">Payment</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end py-2">
                    <button
                      type="button"
                      className="text-sm text-gray-700 hover:text-gray-900"
                      onClick={() => {
                        setSelectedStage('all');
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {bookings.map((booking) => (
            <div key={booking.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {booking.customer.name}
                  </h3>
                  <div className="mt-1 text-sm text-gray-500">
                    Abandoned at: {booking.abandonedAt}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleRecoveryEmail(booking)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Recovery Email
                  </button>
                  <button
                    onClick={() => handleFollowUpCall(booking)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Schedule Call
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Booking Details</h4>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(booking.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {booking.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {booking.address}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Cart Details</h4>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div>Service: {booking.service}</div>
                    <div>Subtotal: ${booking.cart.subtotal}</div>
                    {booking.cart.extras.length > 0 && (
                      <div>
                        Extras: {booking.cart.extras.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Link
                  to={`/admin/bookings/${booking.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                >
                  View Full Details
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

export default AdminIncompleteBookingsPage;