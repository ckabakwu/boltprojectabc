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
  ArrowLeft
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
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const BookingDetailsPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (!bookingId) {
          console.error('No booking ID provided');
          toast.error('No booking ID provided');
          return;
        }

        console.log('Fetching booking with ID:', bookingId); // Debug log

        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            profiles:user_id (
              email,
              full_name
            )
          `)
          .eq('id', bookingId)
          .single();

        console.log('Supabase response:', { data, error }); // Debug log

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (!data) {
          console.error('No booking found');
          throw new Error('Booking not found');
        }

        console.log('Setting booking data:', data); // Debug log
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
        toast.error('Failed to load booking details');
        // Don't navigate away immediately on error
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  // Add debug render log
  console.log('Render state:', { loading, booking, bookingId });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Booking not found</h2>
            <p className="mt-2 text-gray-600">The booking you're looking for doesn't exist or you don't have permission to view it.</p>
            <button
              onClick={() => navigate('/customer-dashboard/bookings')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/customer-dashboard/bookings')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Bookings
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
            <p className="mt-1 text-sm text-gray-500">Booking ID: {booking.id}</p>
          </div>

          <div className="px-6 py-4">
            {/* Status Badge */}
            <div className="mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[booking.status as keyof typeof statusColors]}`}>
                {booking.status === 'pending' && <AlertCircle className="h-4 w-4 mr-2" />}
                {booking.status === 'confirmed' && <CheckCircle className="h-4 w-4 mr-2" />}
                {booking.status === 'completed' && <CheckCircle className="h-4 w-4 mr-2" />}
                {booking.status === 'cancelled' && <XCircle className="h-4 w-4 mr-2" />}
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
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

          {/* Actions */}
          {booking.status === 'pending' && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={async () => {
                    try {
                      const { error } = await supabase
                        .from('bookings')
                        .update({ status: 'cancelled' })
                        .eq('id', booking.id);
                      
                      if (error) throw error;
                      
                      toast.success('Booking cancelled successfully');
                      navigate('/customer-dashboard/bookings');
                    } catch (error) {
                      console.error('Error cancelling booking:', error);
                      toast.error('Failed to cancel booking');
                    }
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage; 