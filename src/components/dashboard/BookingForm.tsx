import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Home, MapPin, DollarSign, Star } from 'lucide-react';
import { bookingService } from '../../lib/bookingService';
import { useAuth } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface BookingFormProps {
  userInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  previousBooking?: {
    service: string;
    bedrooms: string;
    bathrooms: string;
    extras: string[];
  };
}

const BookingForm: React.FC<BookingFormProps> = ({ userInfo, previousBooking }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [service, setService] = useState(previousBooking?.service || 'standard');
  const [bedrooms, setBedrooms] = useState(previousBooking?.bedrooms || '');
  const [bathrooms, setBathrooms] = useState(previousBooking?.bathrooms || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [extras, setExtras] = useState<string[]>(previousBooking?.extras || []);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Pricing calculation
  const basePrice = {
    standard: 120,
    deep: 180,
    move: 220
  };

  const extraPrices = {
    fridge: 30,
    oven: 25,
    windows: 40,
    cabinets: 35,
    laundry: 25
  };

  const calculateTotal = () => {
    let total = basePrice[service as keyof typeof basePrice];
    extras.forEach(extra => {
      total += extraPrices[extra as keyof typeof extraPrices];
    });
    return total;
  };

  const calculateEstimatedDuration = () => {
    const baseTime = {
      standard: 2,
      deep: 4,
      move: 6
    };

    let duration = baseTime[service as keyof typeof baseTime];
    duration += (parseInt(bedrooms) * 0.5) + (parseInt(bathrooms) * 0.5);
    duration += extras.length * 0.5;

    return Math.ceil(duration);
  };

  const validateForm = () => {
    if (!service) {
      toast.error('Please select a service type');
      return false;
    }
    if (!date) {
      toast.error('Please select a date');
      return false;
    }
    if (!time) {
      toast.error('Please select a time');
      return false;
    }
    if (!bedrooms || !bathrooms) {
      toast.error('Please enter property details');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to book a service');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingDetails = {
        service,
        date,
        time,
        address: `${userInfo?.address}, ${userInfo?.city}, ${userInfo?.state}`,
        zipCode: userInfo?.zipCode || '',
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        extras,
        specialInstructions,
        amount: calculateTotal(),
        squareFootage: '',
        serviceFrequency: 'one-time',
        estimatedDuration: calculateEstimatedDuration()
      };

      await bookingService.createBooking(bookingDetails, user.id);
      
      toast.success('Booking created successfully!');
      navigate('/customer-dashboard/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="input-field"
              required
            >
              <option value="standard">Standard Cleaning</option>
              <option value="deep">Deep Cleaning</option>
              <option value="move">Move In/Out Cleaning</option>
            </select>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="input-field"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="input-field"
                min="0"
                required
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Select time</option>
                {[...Array(11)].map((_, i) => {
                  const hour = i + 8; // Start from 8 AM
                  return (
                    <option key={hour} value={`${hour}:00`}>
                      {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Extras */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extra Services
            </label>
            <div className="space-y-2">
              {Object.entries(extraPrices).map(([key, price]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={extras.includes(key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setExtras([...extras, key]);
                      } else {
                        setExtras(extras.filter(extra => extra !== key));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2">
                    {key.charAt(0).toUpperCase() + key.slice(1)} (+${price})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="input-field"
              rows={3}
            />
          </div>

          {/* Total Price */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Price:</span>
              <span className="text-2xl font-bold text-blue-600">
                ${calculateTotal()}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Book Now'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;