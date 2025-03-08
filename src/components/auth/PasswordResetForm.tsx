import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../lib/auth';

const PasswordResetForm = () => {
  const { resetPassword, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      console.error('Password reset error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md"
    >
      {success ? (
        <div className="bg-green-50 text-green-800 p-4 rounded-lg flex items-start">
          <CheckCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="font-medium">Password reset email sent</p>
            <p className="text-sm mt-1">
              Please check your email for instructions to reset your password.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Reset Password'}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default PasswordResetForm;