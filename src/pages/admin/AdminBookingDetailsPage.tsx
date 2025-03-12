import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Home,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  User,
  Mail
} from 'lucide-react';
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

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
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

        console.log('Fetched booking:', data);
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
              <span>{booking.profiles?.full_name || 'N/A'}</span>
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
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[booking.status as keyof typeof statusColors]}`}>
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

export default AdminBookingDetailsPage; 