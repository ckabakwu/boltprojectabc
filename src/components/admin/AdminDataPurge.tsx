import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import mixpanel from '../../lib/analytics';

const AdminDataPurge = () => {
  const [isPurging, setIsPurging] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);
  const [error, setError] = useState('');

  const handlePurgeTestData = async () => {
    setIsPurging(true);
    setError('');
    setPurgeSuccess(false);

    try {
      // Start a transaction to ensure all operations succeed or fail together
      const { error: purgeError } = await supabase.rpc('purge_test_data');

      if (purgeError) throw purgeError;

      // Track successful purge in analytics
      mixpanel.track('Admin:Purge Test Data', {
        timestamp: new Date().toISOString()
      });

      setPurgeSuccess(true);
      setShowConfirm(false);
    } catch (err) {
      console.error('Error purging test data:', err);
      setError('Failed to purge test data. Please try again.');
    } finally {
      setIsPurging(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-full p-3">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">Purge Test Data</h2>
              <p className="text-sm text-gray-500">Remove all test data from the system</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {purgeSuccess && (
          <div className="mb-4 bg-green-50 text-green-600 p-4 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Test data has been successfully purged.
          </div>
        )}

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Warning
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>This action will:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Remove all test bookings and related data</li>
                  <li>Delete test user accounts and profiles</li>
                  <li>Clear test payment records</li>
                  <li>Remove test reviews and ratings</li>
                  <li>This action cannot be undone</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="mr-2 h-5 w-5" />
            Purge Test Data
          </button>
        ) : (
          <div className="space-x-3">
            <button
              onClick={handlePurgeTestData}
              disabled={isPurging}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {isPurging ? (
                <>
                  <RefreshCw className="animate-spin mr-2 h-5 w-5" />
                  Purging...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-5 w-5" />
                  Confirm Purge
                </>
              )}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDataPurge;