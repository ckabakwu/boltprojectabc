import React, { useState, useEffect } from 'react';
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
  Eye,
  Trash2,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Home,
  ArrowLeft,
  Mail
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface Booking {
  id: string;
  user_id: string;
  service_type: string;
  scheduled_date: string;
  scheduled_time: string;
  address: string;
  zip_code: string;
  bedrooms: number;
  bathrooms: number;
  square_footage: string;
  extras: string[];
  special_instructions: string;
  amount: string;
  status: string;
  created_at: string;
  updated_at: string;
  profiles: {
    email: string;
    full_name: string | null;
    role: string;
  };
}

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedService, setSelectedService] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [selectedStatus, selectedService, selectedDateRange]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      // First, check the current user and their role
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);

      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      console.log('User profile:', userProfile);
      if (profileError) console.error('Profile error:', profileError);

      // Then fetch bookings
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles:user_id (
            email,
            full_name,
            role
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }

      console.log('Fetched bookings:', data);
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;
      
      toast.success(`Booking ${newStatus} successfully`);
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking status');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const searchString = searchTerm.toLowerCase();
    return (
      booking.profiles?.full_name?.toLowerCase().includes(searchString) ||
      booking.profiles?.email?.toLowerCase().includes(searchString) ||
      booking.address?.toLowerCase().includes(searchString)
    );
  });

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

  const formatDateTime = (date: string, time: string) => {
    return `${new Date(date).toLocaleDateString()} ${time}`;
  };

  const formatAmount = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and monitor all cleaning service bookings
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search bookings..."
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
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
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
                        <option value="home">Home Cleaning</option>
                        <option value="office">Office Cleaning</option>
                        <option value="airbnb">Airbnb Cleaning</option>
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
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Link
              to="/admin/bookings/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Booking
            </Link>
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
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <React.Fragment key={booking.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <User className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.profiles?.full_name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.profiles?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 capitalize">{booking.service_type}</div>
                        <div className="text-sm text-gray-500">
                          {booking.bedrooms} bed, {booking.bathrooms} bath
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatDateTime(booking.scheduled_date, booking.scheduled_time)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Created: {new Date(booking.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatAmount(booking.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/admin/bookings/${booking.id}`}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                          <Link
                            to={`/admin/bookings/${booking.id}/edit`}
                            className="text-gray-600 hover:text-gray-900 flex items-center"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                    
                    {showDetails === booking.id && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Location Details</h4>
                              <div className="space-y-2 text-sm text-gray-500">
                                <div className="flex items-start">
                                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                                  <span>{booking.address}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-gray-600">ZIP Code: {booking.zip_code}</span>
                                </div>
                                <div className="flex items-center">
                                  <span>Square Footage: {booking.square_footage}</span>
                                </div>
                              </div>
                              
                              {booking.extras && booking.extras.length > 0 && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium text-gray-900 mb-2">Extra Services</h4>
                                  <ul className="list-disc list-inside text-sm text-gray-500">
                                    {booking.extras.map((extra, index) => (
                                      <li key={index} className="capitalize">{extra}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {booking.special_instructions && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium text-gray-900 mb-2">Special Instructions</h4>
                                  <p className="text-sm text-gray-500">{booking.special_instructions}</p>
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Actions</h4>
                              <div className="space-y-2">
                                {booking.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Confirm Booking
                                    </button>
                                    <button
                                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Cancel Booking
                                    </button>
                                  </>
                                )}
                                <Link
                                  to={`/admin/bookings/${booking.id}/edit`}
                                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Booking
                                </Link>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminBookingDetailsPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (!bookingId) return;

        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            profiles:user_id (
              email,
              full_name,
              role
            )
          `)
          .eq('id', bookingId)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Booking not found');

        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const updateBookingStatus = async (status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      setBooking(booking => booking ? { ...booking, status } : null);
      toast.success(`Booking ${status} successfully`);
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Booking not found</h2>
        <p className="mt-2 text-gray-600">The booking you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/admin/bookings')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
            <p className="mt-1 text-sm text-gray-500">Booking ID: {booking.id}</p>
          </div>
          <button
            onClick={() => navigate('/admin/bookings')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Bookings
          </button>
        </div>
      </div>

      <div className="px-6 py-4">
        {/* Customer Information */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <User className="w-5 h-5 mr-2" />
              <span>{booking.profiles?.full_name}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Mail className="w-5 h-5 mr-2" />
              <span>{booking.profiles?.email}</span>
            </div>
          </div>
        </div>

        {/* Status and Actions */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
              {booking.status === 'pending' && <AlertCircle className="h-4 w-4 mr-2" />}
              {booking.status === 'confirmed' && <CheckCircle className="h-4 w-4 mr-2" />}
              {booking.status === 'completed' && <CheckCircle className="h-4 w-4 mr-2" />}
              {booking.status === 'cancelled' && <XCircle className="h-4 w-4 mr-2" />}
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            <div className="space-x-2">
              {booking.status === 'pending' && (
                <>
                  <button
                    onClick={() => updateBookingStatus('confirmed')}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm
                  </button>
                  <button
                    onClick={() => updateBookingStatus('cancelled')}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </>
              )}
              {booking.status === 'confirmed' && (
                <button
                  onClick={() => updateBookingStatus('completed')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Service Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Service Information</h3>
            
            <div className="flex items-center text-gray-600">
              <Home className="w-5 h-5 mr-2" />
              <span className="capitalize">{booking.service_type}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{new Date(booking.scheduled_date).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-2" />
              <span>{booking.scheduled_time}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{booking.address}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <DollarSign className="w-5 h-5 mr-2" />
              <span>${booking.amount}</span>
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Property Details</h3>
            
            <div className="text-gray-600">
              <p><strong>Bedrooms:</strong> {booking.bedrooms}</p>
              <p><strong>Bathrooms:</strong> {booking.bathrooms}</p>
              <p><strong>Square Footage:</strong> {booking.square_footage}</p>
              <p><strong>ZIP Code:</strong> {booking.zip_code}</p>
            </div>

            {booking.extras && booking.extras.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900">Extra Services</h4>
                <ul className="list-disc list-inside text-gray-600 mt-2">
                  {booking.extras.map((extra, index) => (
                    <li key={index} className="capitalize">{extra}</li>
                  ))}
                </ul>
              </div>
            )}

            {booking.special_instructions && (
              <div>
                <h4 className="font-medium text-gray-900">Special Instructions</h4>
                <p className="text-gray-600 mt-2">{booking.special_instructions}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingsPage;