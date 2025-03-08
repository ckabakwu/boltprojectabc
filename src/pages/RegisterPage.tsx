import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, just redirect to dashboard
      window.location.href = '/customer-dashboard';
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container-narrow">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <div className="flex justify-center mb-6">
                <Link to="/" className="flex items-center space-x-2">
                  <Sparkles className="h-8 w-8 text-blue-600" />
                  <span className="text-xl font-bold">HomeMaidy</span>
                </Link>
              </div>
              
              <h1 className="text-2xl font-bold mb-6 text-center">Create Your Account</h1>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
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
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    Log in
                  </Link>
                </p>
              </div>
              
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
      </div>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;