import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, MapPin, DollarSign, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BookingConfirmationProps {
  booking: {
    id: string;
    service: string;
    date: string;
    time: string;
    address: string;
    amount: number;
    provider?: {
      name: string;
      image: string;
      rating: number;
    };
  };
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ booking }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">
          Your cleaning service has been scheduled. We've sent a confirmation email with all the details.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">Booking Details</h3>
            <span className="text-sm text-gray-500">Booking ID: {booking.id}</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <span>{new Date(booking.date).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-2" />
              <span>{booking.time}</span>
            </div>

            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <span>{booking.address}</span>
            </div>

            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
              <span>${booking.amount}</span>
            </div>
          </div>

          {booking.provider && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Your Professional Cleaner</h4>
              <div className="flex items-center">
                <img
                  src={booking.provider.image}
                  alt={booking.provider.name}
                  className="h-10 w-10 rounded-full"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{booking.provider.name}</p>
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < booking.provider.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-sm text-gray-500">
                      {booking.provider.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4">
          <div className="flex justify-between items-center">
            <Link
              to="/customer-dashboard"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Go to Dashboard
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">What's Next?</h3>
        <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
          <ul className="space-y-2">
            <li>We'll send you a reminder 24 hours before your cleaning</li>
            <li>Your cleaner will arrive within the scheduled time window</li>
            <li>You can track your cleaning status in your dashboard</li>
            <li>Rate and review your service after completion</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingConfirmation;