import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, Clock, Calendar, Star, Shield, Users, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const benefits = [
  {
    icon: <DollarSign className="w-6 h-6 text-blue-600" />,
    title: "Competitive Pay",
    description: "Earn up to $25/hour plus tips. Get paid weekly directly to your bank account."
  },
  {
    icon: <Clock className="w-6 h-6 text-blue-600" />,
    title: "Flexible Schedule",
    description: "Work when you want. Set your own hours and availability to fit your lifestyle."
  },
  {
    icon: <Calendar className="w-6 h-6 text-blue-600" />,
    title: "Consistent Work",
    description: "Access a steady stream of jobs in your area with opportunities for repeat clients."
  },
  {
    icon: <Star className="w-6 h-6 text-blue-600" />,
    title: "Build Your Reputation",
    description: "Earn great reviews and build a client base that requests you specifically."
  },
  {
    icon: <Shield className="w-6 h-6 text-blue-600" />,
    title: "Insurance Coverage",
    description: "Work with peace of mind knowing you're covered by our liability insurance."
  },
  {
    icon: <Users className="w-6 h-6 text-blue-600" />,
    title: "Supportive Community",
    description: "Join a network of professionals with training resources and support."
  }
];

const ProSignupPage = () => {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [experience, setExperience] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isLoginMode) {
        // Handle login
        // After successful login, redirect to pro dashboard
        navigate('/pro-dashboard');
      } else {
        // For new sign ups, redirect to pro application
        navigate('/pro-application', {
          state: {
            formData: {
              email,
              firstName,
              lastName,
              phone,
              zipCode,
              experience
            }
          }
        });
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container-narrow">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Login/Signup Form */}
            <div>
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-center mb-6">
                    <Link to="/" className="flex items-center space-x-2">
                      <Sparkles className="h-8 w-8 text-blue-600" />
                      <span className="text-xl font-bold">HomeMaidy</span>
                    </Link>
                  </div>
                  
                  <div className="flex border-b border-gray-200 mb-6">
                    <button
                      className={`w-1/2 py-3 text-center font-medium ${
                        isLoginMode ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                      }`}
                      onClick={() => setIsLoginMode(true)}
                    >
                      Log In
                    </button>
                    <button
                      className={`w-1/2 py-3 text-center font-medium ${
                        !isLoginMode ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                      }`}
                      onClick={() => setIsLoginMode(false)}
                    >
                      Sign Up
                    </button>
                  </div>
                  
                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    {!isLoginMode && (
                      <>
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
                        
                        <div className="mb-4">
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
                      </>
                    )}
                    
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
                    
                    <div className="mb-6">
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
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? 
                        (isLoginMode ? 'Logging in...' : 'Creating account...') : 
                        (isLoginMode ? 'Log In' : 'Create Account')}
                    </button>
                  </form>
                  
                  {isLoginMode ? (
                    <div className="mt-6 text-center">
                      <p className="text-gray-600">
                        Don't have a pro account?{' '}
                        <button 
                          onClick={() => setIsLoginMode(false)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Sign up
                        </button>
                      </p>
                    </div>
                  ) : (
                    <div className="mt-6 text-center">
                      <p className="text-gray-600">
                        Already have a pro account?{' '}
                        <button 
                          onClick={() => setIsLoginMode(true)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Log in
                        </button>
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p className="text-gray-600 text-sm">
                      By signing up, you agree to our{' '}
                      <Link to="/terms" className="text-blue-600 hover:text-blue-800">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-blue-600 hover:text-blue-800">
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Benefits */}
            <div className="hidden md:block">
              <h2 className="text-2xl font-bold mb-6">Join Our Network of Professional Cleaners</h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        {benefit.icon}
                      </div>
                      <h3 className="font-semibold text-lg">{benefit.title}</h3>
                    </div>
                    <p className="text-gray-600">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProSignupPage;