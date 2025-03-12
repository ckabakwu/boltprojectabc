import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Home, 
  DollarSign, 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  Mail, 
  Phone, 
  Building, 
  Check, 
  X,
  User as UserIcon
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../lib/auth';
import { bookingService } from '../lib/bookingService';
import toast from 'react-hot-toast';
import BookingConfirmation from '../components/booking/BookingConfirmation';

// Service options configuration
const serviceOptions = {
  home: {
    label: "Home Cleaning",
    types: [
      { id: 'standard', label: 'Standard Cleaning', basePrice: 120 },
      { id: 'deep', label: 'Deep Cleaning', basePrice: 180 },
      { id: 'move', label: 'Move-In/Move-Out Cleaning', basePrice: 220 }
    ],
    frequencies: [
      { id: 'onetime', label: 'One-Time', discount: 0 },
      { id: 'weekly', label: 'Weekly', discount: 0.15 },
      { id: 'biweekly', label: 'Biweekly', discount: 0.10 },
      { id: 'monthly', label: 'Monthly', discount: 0.05 }
    ],
    extras: [
      { id: 'fridge', label: 'Inside Fridge Cleaning', price: 30 },
      { id: 'oven', label: 'Oven Cleaning', price: 25 },
      { id: 'windows', label: 'Interior Windows', price: 40 },
      { id: 'laundry', label: 'Laundry', price: 20 },
      { id: 'dishes', label: 'Wash Dishes', price: 15 },
      { id: 'fans', label: 'Clean Ceiling Fans', price: 10 }
    ]
  },
  airbnb: {
    label: "Airbnb/Rental Cleaning",
    types: [
      { id: 'standard', label: 'Standard Turnover', basePrice: 140 },
      { id: 'deep', label: 'Deep Cleaning', basePrice: 200 }
    ],
    frequencies: [
      { id: 'onetime', label: 'One-Time', discount: 0 }
    ],
    extras: [
      { id: 'fridge', label: 'Inside Fridge Cleaning', price: 30 },
      { id: 'oven', label: 'Oven Cleaning', price: 25 },
      { id: 'windows', label: 'Interior Windows', price: 40 },
      { id: 'laundry', label: 'Laundry', price: 20 },
      { id: 'dishes', label: 'Wash Dishes', price: 15 },
      { id: 'fans', label: 'Clean Ceiling Fans', price: 10 }
    ]
  },
  office: {
    label: "Office Cleaning",
    types: [
      { id: 'office', label: 'Office Space', basePrice: 150 },
      { id: 'retail', label: 'Retail Space', basePrice: 170 },
      { id: 'restaurant', label: 'Restaurant Space', basePrice: 200 },
      { id: 'warehouse', label: 'Warehouse', basePrice: 250 }
    ],
    frequencies: [
      { id: 'onetime', label: 'One-Time', discount: 0 },
      { id: 'daily', label: 'Daily', discount: 0.25 },
      { id: 'twiceweek', label: 'Twice a Week', discount: 0.20 },
      { id: 'weekly', label: 'Weekly', discount: 0.15 },
      { id: 'biweekly', label: 'Biweekly', discount: 0.10 },
      { id: 'monthly', label: 'Monthly', discount: 0.05 }
    ],
    extras: [
      { id: 'windows', label: 'Interior Windows', price: 60 },
      { id: 'deep', label: 'Deep Cleaning', price: 100 },
      { id: 'sanitize', label: 'Sanitization', price: 80 }
    ]
  }
};

// Square footage options
const squareFootageOptions = [
  { id: '100-1000', label: '100-1000 sq ft', priceMultiplier: 0.8 },
  { id: '1001-2000', label: '1001-2000 sq ft', priceMultiplier: 1 },
  { id: '2001-3000', label: '2001-3000 sq ft', priceMultiplier: 1.3 },
  { id: '3001-4000', label: '3001-4000 sq ft', priceMultiplier: 1.6 },
  { id: '4001+', label: '4001+ sq ft', priceMultiplier: 2 }
];

// Referral source options
const referralSources = [
  { id: 'google', label: 'Google' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'referral', label: 'Referral from a Friend' },
  { id: 'other', label: 'Other' }
];

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryParams = new URLSearchParams(location.search);
  
  // Step tracking
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Base pricing configuration
  const basePricing = {
    home: {
      standard: 120,
      deep: 180,
      move: 220
    },
    airbnb: {
      standard: 140,
      deep: 200
    },
    office: {
      office: 150,
      retail: 170,
      restaurant: 200,
      warehouse: 250
    }
  };

  // Extra service pricing
  const extraPricing = {
    fridge: 30,
    oven: 25,
    windows: 40,
    laundry: 20,
    dishes: 15,
    fans: 10
  };

  // Form data from your existing structure
  const [formData, setFormData] = useState({
    // Step 1: Service Selection
    zipCode: queryParams.get('zip') || '',
    serviceType: 'home',
    cleaningType: 'standard',
    squareFootage: '1001-2000',
    bedrooms: queryParams.get('bedrooms') || '',
    bathrooms: queryParams.get('bathrooms') || '',
    
    // Step 2: Schedule
    date: '',
    time: '',
    frequency: 'onetime',
    
    // Step 3: Details
    extras: [] as string[],
    specialInstructions: '',
    
    // Step 4: Contact & Payment
    firstName: '',
    lastName: '',
    email: queryParams.get('email') || '',
    phone: queryParams.get('phone') || '',
    address: '',
    city: '',
    state: '',
  });

  // Add estimated duration calculation
  const calculateEstimatedDuration = () => {
    const baseTime = {
      standard: 2, // 2 hours
      deep: 4, // 4 hours
      move: 6 // 6 hours
    };

    // Get base duration from service type
    let duration = baseTime[formData.cleaningType] || 2;

    // Add time for rooms
    const bedroomTime = parseInt(formData.bedrooms) * 0.5; // 30 mins per bedroom
    const bathroomTime = parseInt(formData.bathrooms) * 0.5; // 30 mins per bathroom
    duration += bedroomTime + bathroomTime;

    // Add time for extras
    if (formData.extras.length > 0) {
      const extraTime = formData.extras.length * 0.5; // 30 mins per extra service
      duration += extraTime;
    }

    // Adjust for square footage
    const footageMultiplier = {
      '100-1000': 1,
      '1001-2000': 1.2,
      '2001-3000': 1.4,
      '3001-4000': 1.6,
      '4001+': 2
    };
    
    duration *= footageMultiplier[formData.squareFootage] || 1;

    return Math.ceil(duration); // Round up to nearest hour
  };

  // Add estimated duration to state
  const [estimatedDuration, setEstimatedDuration] = useState(2);

  // Update duration when form data changes
  useEffect(() => {
    setEstimatedDuration(calculateEstimatedDuration());
  }, [formData.cleaningType, formData.bedrooms, formData.bathrooms, formData.extras, formData.squareFootage]);

  // Calculate base price
  const calculateBasePrice = () => {
    // Get base price for service type and cleaning type
    const serviceTypePrice = basePricing[formData.serviceType as keyof typeof basePricing];
    if (!serviceTypePrice) return 0;

    const basePrice = serviceTypePrice[formData.cleaningType as keyof typeof serviceTypePrice] || 0;

    // Apply square footage multiplier
    const selectedFootage = squareFootageOptions.find(option => option.id === formData.squareFootage);
    let price = basePrice * (selectedFootage?.priceMultiplier || 1);

    // Add extras
    if (formData.extras.length > 0) {
      const extrasCost = formData.extras.reduce((total, extraId) => {
        return total + (extraPricing[extraId as keyof typeof extraPricing] || 0);
      }, 0);
      price += extrasCost;
    }

    // Apply frequency discount
    const serviceCategory = serviceOptions[formData.serviceType as keyof typeof serviceOptions];
    const selectedFrequency = serviceCategory?.frequencies.find(freq => freq.id === formData.frequency);
    if (selectedFrequency?.discount) {
      price = price * (1 - selectedFrequency.discount);
    }

    return Math.round(price);
  };

  // Calculate total with useMemo for performance
  const totalPrice = useMemo(() => {
    return calculateBasePrice();
  }, [formData.serviceType, formData.cleaningType, formData.squareFootage, formData.extras, formData.frequency]);

  const [bookingConfirmation, setBookingConfirmation] = useState<null | {
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
  }>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to complete your booking');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create booking object matching the database schema
      const bookingDetails = {
        user_id: user.id,
        service_type: formData.serviceType,
        scheduled_date: formData.date,
        scheduled_time: formData.time,
        address: `${formData.address}, ${formData.city}, ${formData.state}`,
        zip_code: formData.zipCode,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        square_footage: formData.squareFootage,
        extras: formData.extras,
        special_instructions: formData.specialInstructions,
        amount: totalPrice,
        status: 'pending'
      };

      // Submit booking
      const response = await bookingService.createBooking(bookingDetails);

      // Set confirmation data for BookingConfirmation component
      setBookingConfirmation({
        id: response.id,
        service: formData.serviceType,
        date: formData.date,
        time: formData.time,
        address: `${formData.address}, ${formData.city}, ${formData.state}`,
        amount: totalPrice,
        provider: response.provider ? {
          name: response.provider.name,
          image: response.provider.image,
          rating: response.provider.rating
        } : undefined
      });

      // Show success message
      toast.success('Booking completed successfully!');

      // Move to confirmation step
      setStep(6);

    } catch (error) {
      console.error('Booking submission error:', error);
      toast.error('Failed to complete booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const validateCurrentStep = () => {
    switch (step) {
      case 1:
        if (!formData.zipCode || !formData.serviceType || !formData.cleaningType) {
          toast.error('Please fill in all required fields');
          return false;
        }
        return true;
      // Add validation for other steps
      default:
        return true;
    }
  };

  const handleExtrasToggle = (extra: string) => {
    if (formData.extras.includes(extra)) {
      setFormData(prev => ({ ...prev, extras: formData.extras.filter(e => e !== extra) }));
    } else {
      setFormData(prev => ({ ...prev, extras: [...formData.extras, extra] }));
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const getSquareFootageLabel = () => {
    return squareFootageOptions.find(option => option.id === formData.squareFootage)?.label || '';
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Book Your Cleaning | HomeMaidy';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container-narrow">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4 text-center">Book Your Cleaning Service</h1>
            
            {/* Progress Steps */}
            <div className="flex justify-between items-center max-w-xl mx-auto mb-8">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <span className="text-sm mt-2">Service</span>
              </div>
              
              <div className={`flex-1 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <span className="text-sm mt-2">Schedule</span>
              </div>
              
              <div className={`flex-1 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  3
                </div>
                <span className="text-sm mt-2">Details</span>
              </div>
              
              <div className={`flex-1 h-1 ${step >= 4 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  4
                </div>
                <span className="text-sm mt-2">Payment</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto">
              {/* Show booking form or confirmation based on step */}
              {step === 6 && bookingConfirmation ? (
                <BookingConfirmation booking={bookingConfirmation} />
              ) : (
                <>
                  {/* Step 1: Service Selection */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <h2 className="text-2xl font-semibold mb-6">Select Your Service</h2>
                      
                      <div className="mb-6">
                        <label htmlFor="zipCode" className="block text-gray-700 mb-2 font-medium">
                          Your Zip Code
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          placeholder="Enter your zip code"
                          className="input-field"
                          value={formData.zipCode}
                          onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                          required
                          pattern="[0-9]{5}"
                          maxLength={5}
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label className="block text-gray-700 mb-2 font-medium">
                          Service Type
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              formData.serviceType === 'home' 
                                ? 'border-blue-600 bg-blue-50' 
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, serviceType: 'home', cleaningType: 'standard' }));
                            }}
                          >
                            <div className="flex items-center">
                              <Home className="w-5 h-5 text-blue-600 mr-2" />
                              <span className="font-medium">Home Cleaning</span>
                            </div>
                          </div>
                          
                          <div
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              formData.serviceType === 'airbnb' 
                                ? 'border-blue-600 bg-blue-50' 
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, serviceType: 'airbnb', cleaningType: 'standard', frequency: 'onetime' }));
                            }}
                          >
                            <div className="flex items-center">
                              <Building className="w-5 h-5 text-blue-600 mr-2" />
                              <span className="font-medium">Airbnb/Rental Cleaning</span>
                            </div>
                          </div>
                          
                          <div
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              formData.serviceType === 'office' 
                                ? 'border-blue-600 bg-blue-50' 
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, serviceType: 'office', cleaningType: 'office' }));
                            }}
                          >
                            <div className="flex items-center">
                              <Building className="w-5 h-5 text-blue-600 mr-2" />
                              <span className="font-medium">Office Cleaning</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="cleaningType" className="block text-gray-700 mb-2 font-medium">
                          Cleaning Type
                        </label>
                        <select
                          id="cleaningType"
                          className="select-field"
                          value={formData.cleaningType}
                          onChange={(e) => setFormData(prev => ({ ...prev, cleaningType: e.target.value }))}
                          required
                        >
                          {serviceOptions[formData.serviceType as keyof typeof serviceOptions].types.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="squareFootage" className="block text-gray-700 mb-2 font-medium">
                          Property Size
                        </label>
                        <select
                          id="squareFootage"
                          className="select-field"
                          value={formData.squareFootage}
                          onChange={(e) => setFormData(prev => ({ ...prev, squareFootage: e.target.value }))}
                          required
                        >
                          {squareFootageOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {(formData.serviceType === 'home' || formData.serviceType === 'airbnb') && (
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <label htmlFor="bedrooms" className="block text-gray-700 mb-2 font-medium">
                              Bedrooms
                            </label>
                            <select
                              id="bedrooms"
                              className="select-field"
                              value={formData.bedrooms}
                              onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                              required
                            >
                              <option value="" disabled>Select</option>
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
                              value={formData.bathrooms}
                              onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                              required
                            >
                              <option value="" disabled>Select</option>
                              <option value="1">1 bathroom</option>
                              <option value="1.5">1.5 bathrooms</option>
                              <option value="2">2 bathrooms</option>
                              <option value="2.5">2.5 bathrooms</option>
                              <option value="3">3 bathrooms</option>
                              <option value="3.5">3.5+ bathrooms</option>
                            </select>
                          </div>
                        </div>
                      )}
                      
                      {formData.serviceType === 'office' && (
                        <div className="mb-6">
                          <label htmlFor="bathrooms" className="block text-gray-700 mb-2 font-medium">
                            Number of Bathrooms
                          </label>
                          <select
                            id="bathrooms"
                            className="select-field"
                            value={formData.bathrooms}
                            onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                            required
                          >
                            <option value="" disabled>Select</option>
                            <option value="1">1 bathroom</option>
                            <option value="2">2 bathrooms</option>
                            <option value="3">3 bathrooms</option>
                            <option value="4">4 bathrooms</option>
                            <option value="5">5+ bathrooms</option>
                          </select>
                        </div>
                      )}
                      
                      <div className="flex justify-end">
                        <button 
                          onClick={nextStep} 
                          className="btn btn-primary"
                        >
                          Continue
                          <ArrowRight className="ml-2" size={18} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Step 2: Schedule */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <h2 className="text-2xl font-semibold mb-6">Schedule Your Cleaning</h2>
                      
                      <div className="mb-6">
                        <label htmlFor="date" className="block text-gray-700 mb-2 font-medium flex items-center">
                          <Calendar className="mr-2" size={18} />
                          Select Date
                        </label>
                        <input
                          type="date"
                          id="date"
                          className="input-field"
                          value={formData.date}
                          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                          required
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label className="block text-gray-700 mb-2 font-medium flex items-center">
                          <Clock className="mr-2" size={18} />
                          Select Time
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {['08:00', '10:00', '12:00', '14:00', '16:00', '17:00'].map((t) => (
                            <button
                              key={t}
                              type="button"
                              className={`py-3 px-4 border rounded-lg text-center transition-all ${
                                formData.time === t 
                                  ? 'bg-blue-600 text-white border-blue-600' 
                                  : 'border-gray-300 hover:border-blue-300'
                              }`}
                              onClick={() => setFormData(prev => ({ ...prev, time: t }))}
                            >
                              {formatTime(t)}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-8">
                        <label className="block text-gray-700 mb-2 font-medium flex items-center">
                          <Calendar className="mr-2" size={18} />
                          Frequency
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {serviceOptions[formData.serviceType as keyof typeof serviceOptions].frequencies.map((freq) => (
                            <button
                              key={freq.id}
                              type="button"
                              className={`py-3 px-4 border rounded-lg text-center transition-all ${
                                formData.frequency === freq.id 
                                  ? 'bg-blue-600 text-white border-blue-600' 
                                  : 'border-gray-300 hover:border-blue-300'
                              }`}
                              onClick={() => setFormData(prev => ({ ...prev, frequency: freq.id }))}
                            >
                              {freq.label}
                              {freq.discount > 0 && (
                                <span className="block text-xs mt-1">
                                  Save {freq.discount * 100}%
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <button 
                          onClick={prevStep} 
                          className="btn btn-secondary"
                        >
                          <ArrowLeft className="mr-2" size={18} />
                          Back
                        </button>
                        <button 
                          onClick={nextStep} 
                          className="btn btn-primary"
                          disabled={!formData.date || !formData.time}
                        >
                          Continue
                          <ArrowRight className="ml-2" size={18} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Step 3: Details */}
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <h2 className="text-2xl font-semibold mb-6">Cleaning Details</h2>
                      
                      <div className="mb-6">
                        <label className="block text-gray-700 mb-3 font-medium">
                          Extra Services
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {serviceOptions[formData.serviceType as keyof typeof serviceOptions].extras.map((extra) => (
                            <div
                              key={extra.id}
                              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                formData.extras.includes(extra.id) 
                                  ? 'border-blue-600 bg-blue-50' 
                                  : 'border-gray-200 hover:border-blue-300'
                              }`}
                              onClick={() => handleExtrasToggle(extra.id)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">{extra.label}</h3>
                                </div>
                                <span className="text-blue-600 font-semibold">+${extra.price}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="specialInstructions" className="block text-gray-700 mb-2 font-medium">
                          Special Instructions
                        </label>
                        <textarea
                          id="specialInstructions"
                          className="input-field min-h-[100px]"
                          placeholder="Any specific requests or instructions for your cleaner?"
                          value={formData.specialInstructions}
                          onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                        ></textarea>
                      </div>
                      
                      <div className="mb-8">
                        <label htmlFor="referralSource" className="block text-gray-700 mb-2 font-medium">
                          How Did You Hear About Us?
                        </label>
                        <select
                          id="referralSource"
                          className="select-field mb-3"
                          value={formData.referralSource}
                          onChange={(e) => setFormData(prev => ({ ...prev, referralSource: e.target.value }))}
                        >
                          <option value="">Select an option</option>
                          {referralSources.map((source) => (
                            <option key={source.id} value={source.id}>
                              {source.label}
                            </option>
                          ))}
                        </select>
                        
                        {formData.referralSource === 'other' && (
                          <input
                            type="text"
                            className="input-field"
                            placeholder="Please specify"
                            value={formData.otherReferralSource}
                            onChange={(e) => setFormData(prev => ({ ...prev, otherReferralSource: e.target.value }))}
                          />
                        )}
                      </div>
                      
                      <div className="flex justify-between">
                        <button 
                          onClick={prevStep} 
                          className="btn btn-secondary"
                        >
                          <ArrowLeft className="mr-2" size={18} />
                          Back
                        </button>
                        <button 
                          onClick={nextStep} 
                          className="btn btn-primary"
                        >
                          Continue
                          <ArrowRight className="ml-2" size={18} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Step 4: Payment */}
                  {step === 4 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <h2 className="text-2xl font-semibold mb-6">Review & Payment</h2>
                      
                      <div className="mb-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center">
                          <UserIcon className="mr-2" size={18} />
                          Contact Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label htmlFor="firstName" className="block text-gray-700 mb-2 font-medium">
                              First Name
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              className="input-field"
                              placeholder="John"
                              value={formData.firstName}
                              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="lastName" className="block text-gray-700 mb-2 font-medium">
                              Last Name
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              className="input-field"
                              placeholder="Smith"
                              value={formData.lastName}
                              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
                              Email Address
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3.5 text-gray-500" size={18} />
                              <input
                                type="email"
                                id="email"
                                className="input-field pl-10"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                required
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="phone" className="block text-gray-700 mb-2 font-medium">
                              Phone Number
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3.5 text-gray-500" size={18} />
                              <input
                                type="tel"
                                id="phone"
                                className="input-field pl-10"
                                placeholder="(123) 456-7890"
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="address" className="block text-gray-700 mb-2 font-medium">
                            Service Address
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3.5 text-gray-500" size={18} />
                            <input
                              type="text"
                              id="address"
                              className="input-field pl-10"
                              placeholder="123 Main St, Apt 4B"
                              value={formData.address}
                              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="city" className="block text-gray-700 mb-2 font-medium">
                              City
                            </label>
                            <input
                              type="text"
                              id="city"
                              className="input-field"
                              placeholder="New York"
                              value={formData.city}
                              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="state" className="block text-gray-700 mb-2 font-medium">
                              State
                            </label>
                            <input
                              type="text"
                              id="state"
                              className="input-field"
                              placeholder="NY"
                              value={formData.state}
                              onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                              required
                              maxLength={2}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg mb-6">
                        <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Service:</span>
                            <span className="font-medium">
                              {serviceOptions[formData.serviceType as keyof typeof serviceOptions].label} - {
                                serviceOptions[formData.serviceType as keyof typeof serviceOptions].types.find(
                                  type => type.id === formData.cleaningType
                                )?.label
                              }
                            </span>
                          </div>
                          
                          {(formData.serviceType === 'home' || formData.serviceType === 'airbnb') && (
                            <div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Property Size:</span>
                                <span className="font-medium">
                                  {getSquareFootageLabel()}, {formData.bedrooms} bedroom{formData.bedrooms !== '1' ? 's' : ''}, {formData.bathrooms} bathroom{formData.bathrooms !== '1' ? 's' : ''}
                                </span>
                              </div>
                            </div>
                          )}
                          
                          {formData.serviceType === 'office' && (
                            <div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Property Size:</span>
                                <span className="font-medium">
                                  {getSquareFootageLabel()}, {formData.bathrooms} bathroom{formData.bathrooms !== '1' ? 's' : ''}
                                </span>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date & Time:</span>
                            <span className="font-medium">
                              {formData.date} at {formatTime(formData.time)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Frequency:</span>
                            <span className="font-medium">
                              {serviceOptions[formData.serviceType as keyof typeof serviceOptions].frequencies.find(f => f.id === formData.frequency)?.label}
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Estimated Duration:</span>
                            <span className="font-medium">
                              {estimatedDuration} hours
                            </span>
                          </div>
                          
                          {formData.extras.length > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Extras:</span>
                              <div className="text-right">
                                {formData.extras.map(extraId => {
                                  const extra = serviceOptions[formData.serviceType as keyof typeof serviceOptions].extras.find(e => e.id === extraId);
                                  return extra && (
                                    <div key={extraId} className="flex justify-between">
                                      <span>{extra.label}</span>
                                      <span className="ml-4">+${extra.price}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          
                          {formData.specialInstructions && (
                            <div className="pt-2">
                              <span className="text-gray-600 block mb-1">Special Instructions:</span>
                              <p className="text-sm bg-white p-2 rounded border border-gray-200">{formData.specialInstructions}</p>
                            </div>
                          )}
                          
                          <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Base Price:</span>
                              <span className="font-medium">${totalPrice}</span>
                            </div>
                            
                            <div className="flex justify-between items-center mt-3 pt-3 border-t">
                              <span className="text-gray-800 font-semibold">Total:</span>
                              <span className="text-xl font-bold text-blue-600">${totalPrice}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                          <h3 className="font-semibold text-lg mb-4 flex items-center">
                            <DollarSign className="mr-2" size={18} />
                            Payment Information
                          </h3>
                          
                          <div className="mb-4">
                            <label htmlFor="cardName" className="block text-gray-700 mb-2 font-medium">
                              Name on Card
                            </label>
                            <input
                              type="text"
                              id="cardName"
                              className="input-field"
                              placeholder="John Smith"
                              required
                            />
                          </div>
                          
                          <div className="mb-4">
                            <label htmlFor="cardNumber" className="block text-gray-700 mb-2 font-medium">
                              Card Number
                            </label>
                            <input
                              type="text"
                              id="cardNumber"
                              className="input-field"
                              placeholder="1234 5678 9012 3456"
                              required
                              maxLength={19}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="expiry" className="block text-gray-700 mb-2 font-medium">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                id="expiry"
                                className="input-field"
                                placeholder="MM/YY"
                                required
                                maxLength={5}
                              />
                            </div>
                            <div>
                              <label htmlFor="cvv" className="block text-gray-700 mb-2 font-medium">
                                CVV
                              </label>
                              <input
                                type="text"
                                id="cvv"
                                className="input-field"
                                placeholder="123"
                                required
                                maxLength={4}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <button 
                            onClick={prevStep} 
                            className="btn btn-secondary"
                            type="button"
                          >
                            <ArrowLeft className="mr-2" size={18} />
                            Back
                          </button>
                          <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={
                              isSubmitting || 
                              !formData.firstName || 
                              !formData.lastName || 
                              !formData.email || 
                              !formData.phone || 
                              !formData.address || 
                              !formData.city || 
                              !formData.state
                            }
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
                              'Complete Booking'
                            )}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookingPage;