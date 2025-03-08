import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PasswordResetForm from '../components/auth/PasswordResetForm';

const ForgotPasswordPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Reset Password | HomeMaidy';
  }, []);

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
              
              <h1 className="text-2xl font-bold mb-6 text-center">Reset Your Password</h1>
              
              <p className="text-gray-600 mb-8 text-center">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
              
              <PasswordResetForm />
              
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Remember your password?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    Back to login
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

export default ForgotPasswordPage;