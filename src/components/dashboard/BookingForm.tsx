import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Home, MapPin, DollarSign, Star } from 'lucide-react';

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
  // Form state
  const [service, setService] = useState(previousBooking?.service || 'standard');
  const [bedrooms, setBedrooms] = useState(previousBooking?.bedrooms || '');
  const [bathrooms, setBathrooms] = useState(previousBooking?.bathrooms || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [extras, setExtras] = useState<string[]>(previousBooking?.extras || []);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    laundry: 20,
    dishes: 15,
    fans: 10
  };

  const calculateTotal = () => {
    let total = basePrice[service as keyof typeof basePrice];
    extras.forEach(extra => {
      total += extraPrices[extra as keyof typeof extraPrices];
    });
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    // Navigate to confirmation or handle response
  };

  const handleExtraToggle = (extra: string) => {
    if (extras.includes(extra)) {
      setExtras(extras.filter(e => e !== extra));
    } else {
      setExtras([...extras, extra]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Book a Cleaning</h2>

        <form onSubmit={handleSubmit}>
          {/* Service Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">
              Service Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  service === 'standard' 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setService('standard')}
              >
                <div className="flex items-center">
                  <Home className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium">Standard Cleaning</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Regular cleaning for maintenance
                </p>
                <p className="text-sm font-medium text-blue-600 mt-1">
                  From ${basePrice.standard}
                </p>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  service === 'deep' 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setService('deep')}
              >
                <div className="flex items-center">
                  <Home className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium">Deep Cleaning</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Thorough, detailed cleaning
                </p>
                <p className="text-sm font-medium text-blue-600 mt-1">
                  From ${basePrice.deep}
                </p>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  service === 'move' 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setService('move')}
              >
                <div className="flex items-center">
                  <Home className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium">Move In/Out</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Complete cleaning for moving
                </p>
                <p className="text-sm font-medium text-blue-600 mt-1">
                  From ${basePrice.move}
                </p>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="bedrooms" className="block text-gray-700 mb-2 font-medium">
                Bedrooms
              </label>
              <select
                id="bedrooms"
                className="select-field"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="0">Studio</option>
                <option value="1">1 bedroom</option>
                <option value="2">2 bedrooms</option>
                <option value="3">3 bedrooms</option>
                <option value="4">4 bedrooms</option>
                <option value="5">5+ bedrooms</option>
              </select>
            </div>

            <div>
              <label htmlFor="bathrooms" className="block text-gray-700 mb-2 font-medium">
                Bathrooms
              </label>
              <select
                id="bathrooms"
                className="select-field"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="1">1 bathroom</option>
                <option value="1.5">1.5 bathrooms</option>
                <option value="2">2 bathrooms</option>
                <option value="2.5">2.5 bathrooms</option>
                <option value="3">3 bathrooms</option>
                <option value="3.5">3.5+ bathrooms</option>
              </select>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="date" className="block text-gray-700 mb-2 font-medium">
                Date
              </label>
              <input
                type="date"
                id="date"
                className="input-field"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-gray-700 mb-2 font-medium">
                Time
              </label>
              <select
                id="time"
                className="select-field"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="08:00">8:00 AM</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
              </select>
            </div>
          </div>

          {/* Extra Services */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">
              Extra Services
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  extras.includes('fridge') 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleExtraToggle('fridge')}
              >
                <div className="flex justify-between items-center">
                  <span>Inside Fridge</span>
                  <span className="text-blue-600 font-medium">+$30</span>
                </div>
              </div>

              <div
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  extras.includes('oven') 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleExtraToggle('oven')}
              >
                <div className="flex justify-between items-center">
                  <span>Oven Cleaning</span>
                  <span className="text-blue-600 font-medium">+$25</span>
                </div>
              </div>

              <div
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  extras.includes('windows') 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleExtraToggle('windows')}
              >
                <div className="flex justify-between items-center">
                  <span>Interior Windows</span>
                  <span className="text-blue-600 font-medium">+$40</span>
                </div>
              </div>

              <div
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  extras.includes('laundry') 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleExtraToggle('laundry')}
              >
                <div className="flex justify-between items-center">
                  <span>Laundry</span>
                  <span className="text-blue-600 font-medium">+$20</span>
                </div>
              </div>

              <div
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  extras.includes('dishes') 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleExtraToggle('dishes')}
              >
                <div className="flex justify-between items-center">
                  <span>Wash Dishes</span>
                  <span className="text-blue-600 font-medium">+$15</span>
                </div>
              </div>

              <div
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  extras.includes('fans') 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleExtraToggle('fans')}
              >
                <div className="flex justify-between items-center">
                  <span>Clean Ceiling Fans</span>
                  <span className="text-blue-600 font-medium">+$10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="mb-6">
            <label htmlFor="instructions" className="block text-gray-700 mb-2 font-medium">
              Special Instructions
            </label>
            <textarea
              id="instructions"
              className="input-field min-h-[100px]"
              placeholder="Any specific requests or instructions for your cleaner?"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            ></textarea>
          </div>

          {/* Location */}
          {userInfo ? (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Service Location</h3>
                <button type="button" className="text-blue-600 text-sm font-medium">
                  Change
                </button>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mt-1 mr-2" />
                <div>
                  <p className="text-gray-900">{userInfo.address}</p>
                  <p className="text-gray-600">
                    {userInfo.city}, {userInfo.state} {userInfo.zipCode}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="address" className="block text-gray-700 mb-2 font-medium">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  className="input-field"
                  placeholder="123 Main St"
                  required
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-gray-700 mb-2 font-medium">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  className="input-field"
                  placeholder="City"
                  required
                />
              </div>
            </div>
          )}

          {/* Price Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-4">Price Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Base Price</span>
                <span>${basePrice[service as keyof typeof basePrice]}</span>
              </div>
              {extras.length > 0 && extras.map(extra => (
                <div key={extra} className="flex justify-between text-sm">
                  <span>{extra.charAt(0).toUpperCase() + extra.slice(1)}</span>
                  <span>+${extraPrices[extra as keyof typeof extraPrices]}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Book Cleaning'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;