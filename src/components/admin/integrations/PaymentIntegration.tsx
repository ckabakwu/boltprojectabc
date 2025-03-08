import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, CreditCard, Key, Globe, Lock } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const stripeConfigSchema = z.object({
  publishableKey: z.string().min(1, 'Publishable key is required'),
  secretKey: z.string().min(1, 'Secret key is required'),
  webhookSecret: z.string().min(1, 'Webhook secret is required'),
  mode: z.enum(['test', 'live']),
  enableRecurring: z.boolean(),
  enableInstantPayouts: z.boolean(),
  webhookEndpoint: z.string().url('Must be a valid URL')
});

const PaymentIntegration: React.FC = () => {
  const [isTestMode, setIsTestMode] = useState(true);
  const [isTesting, setIsTesting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(stripeConfigSchema)
  });

  const handleTest = async () => {
    setIsTesting(true);
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsTesting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-blue-100 p-3 rounded-lg">
            <DollarSign className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium">Payment Processing</h3>
            <p className="text-sm text-gray-500">Configure Stripe payment integration</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Test Mode</span>
            <button
              type="button"
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isTestMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
              onClick={() => setIsTestMode(!isTestMode)}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isTestMode ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Publishable Key
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                {...register('publishableKey')}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder={`${isTestMode ? 'pk_test_' : 'pk_live_'}...`}
              />
            </div>
            {errors.publishableKey && (
              <p className="mt-1 text-sm text-red-600">{errors.publishableKey.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Secret Key
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                {...register('secretKey')}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder={`${isTestMode ? 'sk_test_' : 'sk_live_'}...`}
              />
            </div>
            {errors.secretKey && (
              <p className="mt-1 text-sm text-red-600">{errors.secretKey.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Webhook Secret
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                {...register('webhookSecret')}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="whsec_..."
              />
            </div>
            {errors.webhookSecret && (
              <p className="mt-1 text-sm text-red-600">{errors.webhookSecret.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Webhook Endpoint
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                {...register('webhookEndpoint')}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="https://your-domain.com/api/webhooks/stripe"
              />
            </div>
            {errors.webhookEndpoint && (
              <p className="mt-1 text-sm text-red-600">{errors.webhookEndpoint.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('enableRecurring')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Enable recurring payments
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('enableInstantPayouts')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Enable instant payouts for pros
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isTesting ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentIntegration;