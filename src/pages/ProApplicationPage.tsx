import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProApplicationPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [experience, setExperience] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleServiceToggle = (service: string) => {
    if (services.includes(service)) {
      setServices(services.filter(s => s !== service));
    } else {
      setServices([...services, service]);
    }
  };

  const handleAvailabilityToggle = (day: string) => {
    if (availability.includes(day)) {
      setAvailability(availability.filter(d => d !== day));
    } else {
      setAvailability([...availability, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep(4); // Move to success step
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container-narrow">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <div className="flex justify-center mb-6">
                <Link to="/" className="flex items-center space-x-2">
                  <Sparkles className="h-8 w-8 text-blue-600" />
                  <span className="text-xl font-bold">HomeMaidy</span>
                </Link>
              </div>
              
              <h2 className="text-2xl font-bold mb-6 text-center">Apply as a Professional Cleaner</h2>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                  
                  <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
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
                    
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="input-field"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="phone" className="block text-gray-700 mb-2 font-medium">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        className="input-field"
                        placeholder="(123) 456-7890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        className="input-field"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Password must be at least 8 characters long
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="zipCode" className="block text-gray-700 mb-2 font-medium">
                        Zip Code (Service Area)
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        className="input-field"
                        placeholder="10001"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        required
                        pattern="[0-9]{5}"
                        maxLength={5}
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="experience" className="block text-gray-700 mb-2 font-medium">
                        Years of Experience
                      </label>
                      <select
                        id="experience"
                        className="select-field"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        required
                      >
                        <option value="">Select experience</option>
                        <option value="0-1">Less than 1 year</option>
                        <option value="1-3">1-3 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5+">5+ years</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-end">
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                      >
                        Continue
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
              
              {/* Step 2: Services & Availability */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-xl font-semibold mb-6">Services & Availability</h2>
                  
                  <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                    <div className="mb-6">
                      <label className="block text-gray-700 mb-3 font-medium">
                        Services You Provide
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            services.includes('standard') 
                              ? 'border-blue-600 bg-blue-50' 
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => handleServiceToggle('standard')}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                              services.includes('standard') ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                            }`}>
                              {services.includes('standard') && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </div>
                            <span className="font-medium">Standard Cleaning</span>
                          </div>
                        </div>
                        
                        <div
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            services.includes('deep') 
                              ? 'border-blue-600 bg-blue-50' 
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => handleServiceToggle('deep')}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                              services.includes('deep') ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                            }`}>
                              {services.includes('deep') && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </div>
                            <span className="font-medium">Deep Cleaning</span>
                          </div>
                        </div>
                        
                        <div
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            services.includes('move') 
                              ? 'border-blue-600 bg-blue-50' 
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => handleServiceToggle('move')}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                              services.includes('move') ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                            }`}>
                              {services.includes('move') && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </div>
                            <span className="font-medium">Move In/Out Cleaning</span>
                          </div>
                        </div>
                        
                        <div
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            services.includes('office') 
                              ? 'border-blue-600 bg-blue-50' 
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => handleServiceToggle('office')}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                              services.includes('office') ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                            }`}>
                              {services.includes('office') && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </div>
                            <span className="font-medium">Office Cleaning</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 mb-3 font-medium">
                        Availability
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                          <div
                            key={day}
                            className={`border rounded-lg p-3 cursor-pointer transition-all text-center ${
                              availability.includes(day) 
                                ? 'border-blue-600 bg-blue-50' 
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                            onClick={() => handleAvailabilityToggle(day)}
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <button 
                        type="button" 
                        onClick={prevStep}
                        className="btn btn-secondary"
                      >
                        Back
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                      >
                        Continue
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Step 3: Background Check Consent */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-xl font-semibold mb-6">Background Check Consent</h2>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                      <p className="text-gray-700 mb-4">
                        To ensure the safety and security of our customers, all professional cleaners must undergo a background check before being approved to work on our platform.
                      </p>
                      
                      <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <h3 className="font-semibold text-blue-800 mb-2">What we check:</h3>
                        <ul className="list-disc pl-5 text-blue-700 space-y-1">
                          <li>Identity verification</li>
                          <li>Criminal background check</li>
                          <li>Sex offender registry check</li>
                          <li>Global watchlist check</li>
                        </ul>
                      </div>
                      
                      <div className="mb-6">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="consent"
                              name="consent"
                              type="checkbox"
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              required
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="consent" className="font-medium text-gray-700">I consent to a background check</label>
                            <p className="text-gray-500">
                              I authorize HomeMaidy to obtain my background check report and understand that I may request a copy of this report.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="terms"
                              name="terms"
                              type="checkbox"
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              required
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="font-medium text-gray-700">I agree to the Terms of Service</label>
                            <p className="text-gray-500">
                              I have read and agree to the <Link to="/terms" className="text-blue-600 hover:text-blue-800">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link>.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <button 
                        type="button" 
                        onClick={prevStep}
                        className="btn btn-secondary"
                      >
                        Back
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4">Application Submitted!</h2>
                  <p className="text-gray-600 mb-6">
                    Thank you for applying to join HomeMaidy as a professional cleaner. We'll review your application and get back to you within 1-2 business days.
                  </p>
                  
                  <Link to="/pro-signup" className="btn btn-primary">
                    Go to Pro Login
                  </Link>
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

export default ProApplicationPage;