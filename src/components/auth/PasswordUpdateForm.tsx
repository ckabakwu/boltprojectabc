import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../lib/auth';

const PasswordUpdateForm = () => {
  const { updatePassword, error, clearError } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/\d/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return 'Password must contain at least one special character (!@#$%^&*)';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();
    setValidationError('');

    // Validate new password
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setValidationError(passwordError);
      setIsSubmitting(false);
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setValidationError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      await updatePassword(newPassword);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Password update error:', err);
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
      {success && (
        <div className="bg-green-50 text-green-800 p-4 rounded-lg flex items-start mb-6">
          <CheckCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="font-medium">Password updated successfully</p>
            <p className="text-sm mt-1">
              Your password has been changed. Please use your new password the next time you log in.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {(error || validationError) && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
            <p className="font-medium">{error || validationError}</p>
          </div>
        )}

        <div>
          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="current-password"
              type="password"
              required
              className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="new-password"
              type="password"
              required
              className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Password must be at least 8 characters long and contain at least one number, one uppercase letter, one lowercase letter, and one special character.
          </p>
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirm-password"
              type="password"
              required
              className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default PasswordUpdateForm;