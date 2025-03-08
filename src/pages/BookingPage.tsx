import React, { useState, useEffect } from 'react';
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
  const queryParams = new URLSearchParams(location.search);
  
  // Step tracking
  const [step, setStep] = useState(1);
  
  // Step 1: Service Selection
  const [zipCode, setZipCode] = useState(queryParams.get('zip') || '');
  const [serviceType, setServiceType] = useState('home');
  const [cleaningType, setCleaningType] = useState('standard');
  const [squareFootage, setSquareFootage] = useState('1001-2000');
  const [bedrooms, setBedrooms] = useState(queryParams.get('bedrooms') || '');
  const [bathrooms, setBathrooms] = useState(queryParams.get('bathrooms') || '');
  
  // Step 2: Schedule
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [frequency, setFrequency] = useState('onetime');
  
  // Step 3: Details
  const [extras, setExtras] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [otherReferralSource, setOtherReferralSource] = useState('');
  
  // Step 4: Contact & Payment
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(queryParams.get('email') || '');
  const [phone, setPhone] = useState(queryParams.get('phone') || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [isCouponValid, setIsCouponValid] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  
  // Pricing calculations
  const [basePrice, setBasePrice] = useState(0);
  const [extrasTotal, setExtrasTotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [estimatedDuration, setEstimatedDuration] = useState(0);

  // Calculate price based on selections
  useEffect(() => {
    // Get base price from selected service and cleaning type
    let base = serviceOptions[serviceType as keyof typeof serviceOptions].types.find(
      type => type.id === cleaningType
    )?.basePrice || 0;
    
    // Apply square footage multiplier
    const sqftMultiplier = squareFootageOptions.find(
      option => option.id === squareFootage
    )?.priceMultiplier || 1;
    
    base = Math.round(base * sqftMultiplier);
    
    // Calculate extras total
    const extrasSum = extras.reduce((sum, extraId) => {
      const extraItem = serviceOptions[serviceType as keyof typeof serviceOptions].extras.find(
        e => e.id === extraId
      );
      return sum + (extraItem?.price || 0);
    }, 0);
    
    // Calculate frequency discount
    const frequencyDiscount = serviceOptions[serviceType as keyof typeof serviceOptions].frequencies.find(
      f => f.id === frequency
    )?.discount || 0;
    
    const discountValue = Math.round(base * frequencyDiscount);
    
    // Calculate total price
    let total = base + extrasSum - discountValue;
    
    // Apply coupon discount if valid
    if (isCouponValid && couponDiscount > 0) {
      total = Math.round(total * (1 - couponDiscount));
    }
    
    // Estimate duration based on service type, square footage, and extras
    let duration = 2; // Base duration in hours
    
    // Adjust for cleaning type
    if (cleaningType === 'deep') duration += 1;
    if (cleaningType === 'move') duration += 2;
    
    // Adjust for square footage
    if (squareFootage === '2001-3000') duration += 0.5;
    if (squareFootage === '3001-4000') duration += 1;
    if (squareFootage === '4001+') duration += 1.5;
    
    // Adjust for extras (add 15 minutes per extra)
    duration += extras.length * 0.25;
    
    // Set state values
    setBasePrice(base);
    setExtrasTotal(extrasSum);
    setDiscountAmount(discountValue);
    setTotalPrice(total);
    setEstimatedDuration(duration);
  }, [serviceType, cleaningType, squareFootage, extras, frequency, isCouponValid, couponDiscount]);

  const handleExtrasToggle = (extra: string) => {
    if (extras.includes(extra)) {
      setExtras(extras.filter(e => e !== extra));
    } else {
      setExtras([...extras, extra]);
    }
  };

  const nextStep = () => {
    window.scrollTo(0, 0);
    setStep(step + 1);
  };

  const prevStep = () => {
    window.scrollTo(0, 0);
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the booking to the backend
    navigate('/booking-confirmation');
  };

  const validateCoupon = () => {
    // Simulate coupon validation
    if (couponCode.toLowerCase() === 'welcome10') {
      setIsCouponValid(true);
      setCouponDiscount(0.1);
      setCouponMessage('Coupon applied: 10% off');
    } else if (couponCode.toLowerCase() === 'clean20') {
      setIsCouponValid(true);
      setCouponDiscount(0.2);
      setCouponMessage('Coupon applied: 20% off');
    } else {
      setIsCouponValid(false);
      setCouponDiscount(0);
      setCouponMessage('Invalid coupon code');
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
    return squareFootageOptions.find(option => option.id === squareFootage)?.label || '';
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
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
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
                          serviceType === 'home' 
                            ? 'border-blue-600 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => {
                          setServiceType('home');
                          setCleaningType('standard');
                        }}
                      >
                        <div className="flex items-center">
                          <Home className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="font-medium">Home Cleaning</span>
                        </div>
                      </div>
                      
                      <div
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          serviceType === 'airbnb' 
                            ? 'border-blue-600 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => {
                          setServiceType('airbnb');
                          setCleaningType('standard');
                          setFrequency('onetime');
                        }}
                      >
                        <div className="flex items-center">
                          <Building className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="font-medium">Airbnb/Rental Cleaning</span>
                        </div>
                      </div>
                      
                      <div
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          serviceType === 'office' 
                            ? 'border-blue-600 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => {
                          setServiceType('office');
                          setCleaningType('office');
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
                      value={cleaningType}
                      onChange={(e) => setCleaningType(e.target.value)}
                      required
                    >
                      {serviceOptions[serviceType as keyof typeof serviceOptions].types.map((type) => (
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
                      value={squareFootage}
                      onChange={(e) => setSquareFootage(e.target.value)}
                      required
                    >
                      {squareFootageOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {(serviceType === 'home' || serviceType === 'airbnb') && (
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
                          value={bathrooms}
                          onChange={(e) => setBathrooms(e.target.value)}
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
                  
                  {serviceType === 'office' && (
                    <div className="mb-6">
                      <label htmlFor="bathrooms" className="block text-gray-700 mb-2 font-medium">
                        Number of Bathrooms
                      </label>
                      <select
                        id="bathrooms"
                        className="select-field"
                        value={bathrooms}
                        onChange={(e) => setBathrooms(e.target.value)}
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
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
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
                            time === t 
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                          onClick={() => setTime(t)}
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
                      {serviceOptions[serviceType as keyof typeof serviceOptions].frequencies.map((freq) => (
                        <button
                          key={freq.id}
                          type="button"
                          className={`py-3 px-4 border rounded-lg text-center transition-all ${
                            frequency === freq.id 
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                          onClick={() => setFrequency(freq.id)}
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
                      disabled={!date || !time}
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
                      {serviceOptions[serviceType as keyof typeof serviceOptions].extras.map((extra) => (
                        <div
                          key={extra.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            extras.includes(extra.id) 
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
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <div className="mb-8">
                    <label htmlFor="referralSource" className="block text-gray-700 mb-2 font-medium">
                      How Did You Hear About Us?
                    </label>
                    <select
                      id="referralSource"
                      className="select-field mb-3"
                      value={referralSource}
                      onChange={(e) => setReferralSource(e.target.value)}
                    >
                      <option value="">Select an option</option>
                      {referralSources.map((source) => (
                        <option key={source.id} value={source.id}>
                          {source.label}
                        </option>
                      ))}
                    </select>
                    
                    {referralSource === 'other' && (
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Please specify"
                        value={otherReferralSource}
                        onChange={(e) => setOtherReferralSource(e.target.value)}
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
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
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
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
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
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
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
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
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
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          required
                          maxLength={2}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg flex items-center">
                        <DollarSign className="mr-2" size={18} />
                        Coupon Code
                      </h3>
                    </div>
                    
                    <div className="flex mb-2">
                      <input
                        type="text"
                        className="input-field rounded-r-none"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={validateCoupon}
                        className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    
                    {couponMessage && (
                      <div className={`text-sm ${isCouponValid ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                        {isCouponValid ? (
                          <Check className="w-4 h-4 mr-1" />
                        ) : (
                          <X className="w-4 h-4 mr-1" />
                        )}
                        {couponMessage}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service:</span>
                        <span className="font-medium">
                          {serviceOptions[serviceType as keyof typeof serviceOptions].label} - {
                            serviceOptions[serviceType as keyof typeof serviceOptions].types.find(
                              type => type.id === cleaningType
                            )?.label
                          }
                        </span>
                      </div>
                      
                      {(serviceType === 'home' || serviceType === 'airbnb') && (
                        <div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Property Size:</span>
                            <span className="font-medium">
                              {getSquareFootageLabel()}, {bedrooms} bedroom{bedrooms !== '1' ? 's' : ''}, {bathrooms} bathroom{bathrooms !== '1' ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {serviceType === 'office' && (
                        <div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Property Size:</span>
                            <span className="font-medium">
                              {getSquareFootageLabel()}, {bathrooms} bathroom{bathrooms !== '1' ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date & Time:</span>
                        <span className="font-medium">
                          {date} at {formatTime(time)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Frequency:</span>
                        <span className="font-medium">
                          {serviceOptions[serviceType as keyof typeof serviceOptions].frequencies.find(f => f.id === frequency)?.label}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Duration:</span>
                        <span className="font-medium">
                          {estimatedDuration} hours
                        </span>
                      </div>
                      
                      {extras.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Extras:</span>
                          <div className="text-right">
                            {extras.map(extraId => {
                              const extra = serviceOptions[serviceType as keyof typeof serviceOptions].extras.find(e => e.id === extraId);
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
                      
                      {specialInstructions && (
                        <div className="pt-2">
                          <span className="text-gray-600 block mb-1">Special Instructions:</span>
                          <p className="text-sm bg-white p-2 rounded border border-gray-200">{specialInstructions}</p>
                        </div>
                      )}
                      
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Base Price:</span>
                          <span className="font-medium">${basePrice}</span>
                        </div>
                        
                        {extrasTotal > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Extras Total:</span>
                            <span className="font-medium">+${extrasTotal}</span>
                          </div>
                        )}
                        
                        {discountAmount > 0 && (
                          <div className="flex justify-between items-center text-green-600">
                            <span>Frequency Discount:</span>
                            <span className="font-medium">-${discountAmount}</span>
                          </div>
                        )}
                        
                        {isCouponValid && couponDiscount > 0 && (
                          <div className="flex justify-between items-center text-green-600">
                            <span>Coupon Discount:</span>
                            <span className="font-medium">-${Math.round((basePrice + extrasTotal - discountAmount) * couponDiscount)}</span>
                          </div>
                        )}
                        
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
                        disabled={!firstName || !lastName || !email || !phone || !address || !city || !state}
                      >
                        Complete Booking
                      </button>
                    </div>
                  </form>
                </motion.div>
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