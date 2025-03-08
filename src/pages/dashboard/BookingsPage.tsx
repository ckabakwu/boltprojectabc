import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Star, 
  ChevronRight,
  ChevronDown,
  User,
  CheckCircle,
  XCircle,
  List,
  Grid
} from 'lucide-react';
import BookingCalendar from '../../components/dashboard/BookingCalendar';

// Mock data for bookings
const upcomingBookings = [
  {
    id: 1,
    date: '2025-06-15',
    time: '10:00',
    service: 'Standard Cleaning',
    address: '123 Main St, Apt 4B',
    status: 'confirmed',
    cleaner: {
      name: 'Maria Rodriguez',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
    }
  }
];

const pastBookings = [
  {
    id: 2,
    date: '2025-06-01',
    time: '14:00',
    service: 'Deep Cleaning',
    address: '123 Main St, Apt 4B',
    status: 'completed',
    cleaner: {
      name: 'David Wilson',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
    },
    userRating: 5
  }
];

const BookingsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleDateSelect = (date: Date) => {
    console.log('Selected date:', date);
    // Handle date selection - could filter bookings, etc.
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage your cleaning appointments.
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-lg ${
                viewMode === 'calendar' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search bookings..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                Filter
                <ChevronDown className="ml-2 h-5 w-5 text-gray-400" />
              </button>
              
              {filterOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setSelectedStatus('all')}
                    >
                      All Bookings
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setSelectedStatus('confirmed')}
                    >
                      Confirmed
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setSelectedStatus('completed')}
                    >
                      Completed
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setSelectedStatus('cancelled')}
                    >
                      Cancelled
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <Link
              to="/booking"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Book New Cleaning
            </Link>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      {viewMode === 'calendar' ? (
        <BookingCalendar 
          bookings={[...upcomingBookings, ...pastBookings]}
          onDateSelect={handleDateSelect}
        />
      ) : (
        <>
          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`${
                    activeTab === 'upcoming'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`${
                    activeTab === 'past'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Past
                </button>
              </nav>
            </div>
          </div>

          {/* Bookings List */}
          {activeTab === 'upcoming' ? (
            <div className="space-y-6">
              {upcomingBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white shadow rounded-lg overflow-hidden"
                >
                  {/* Booking card content */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div className="flex items-center mb-3 md:mb-0">
                        <CalendarIcon className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="font-semibold">{formatDate(booking.date)}</span>
                        <span className="mx-2 text-gray-400">|</span>
                        <Clock className="w-5 h-5 text-blue-600 mr-2" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg">{booking.service}</h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{booking.address}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src={booking.cleaner.image} 
                          alt={booking.cleaner.name} 
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-medium">{booking.cleaner.name}</p>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm ml-1">{booking.cleaner.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Link
                          to={`/customer-dashboard/bookings/${booking.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                        >
                          View Details
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {pastBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white shadow rounded-lg overflow-hidden"
                >
                  {/* Past booking card content */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div className="flex items-center mb-3 md:mb-0">
                        <CalendarIcon className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="font-semibold">{formatDate(booking.date)}</span>
                        <span className="mx-2 text-gray-400">|</span>
                        <Clock className="w-5 h-5 text-blue-600 mr-2" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                        Completed
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg">{booking.service}</h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{booking.address}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src={booking.cleaner.image} 
                          alt={booking.cleaner.name} 
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-medium">{booking.cleaner.name}</p>
                          <div className="flex items-center">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${
                                    i < booking.userRating 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm ml-1">Your rating</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Link
                          to="/booking"
                          className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Book Again
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookingsPage;