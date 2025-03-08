import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Key, Settings, User, Filter } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const analyticsConfigSchema = z.object({
  projectToken: z.string().min(1, 'Project token is required'),
  apiSecret: z.string().min(1, 'API secret is required'),
  serverUrl: z.string().url('Must be a valid URL'),
  enableUserIdentification: z.boolean(),
  enableCustomEvents: z.boolean(),
  sampleRate: z.number().min(0).max(100),
  customProperties: z.array(z.object({
    name: z.string(),
    type: z.enum(['string', 'number', 'boolean'])
  }))
});

const AnalyticsIntegration: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [customProperties, setCustomProperties] = useState([
    { name: 'userType', type: 'string' },
    { name: 'subscriptionTier', type: 'string' },
    { name: 'totalBookings', type: 'number' }
  ]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(analyticsConfigSchema),
    defaultValues: {
      sampleRate: 100,
      enableUserIdentification: true,
      enableCustomEvents: true,
      customProperties
    }
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
          <div className="bg-purple-100 p-3 rounded-lg">
            <BarChart2 className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium">Analytics & Tracking</h3>
            <p className="text-sm text-gray-500">Configure Mixpanel integration</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Project Token
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                {...register('projectToken')}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            {errors.projectToken && (
              <p className="mt-1 text-sm text-red-600">{errors.projectToken.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              API Secret
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                {...register('apiSecret')}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            {errors.apiSecret && (
              <p className="mt-1 text-sm text-red-600">{errors.apiSecret.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Server URL
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="url"
                {...register('serverUrl')}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="https://api.mixpanel.com"
              />
            </div>
            {errors.serverUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.serverUrl.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sample Rate (%)
            </label>
            <input
              type="number"
              {...register('sampleRate')}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              min="0"
              max="100"
            />
            {errors.sampleRate && (
              <p className="mt-1 text-sm text-red-600">{errors.sampleRate.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('enableUserIdentification')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Enable user identification
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('enableCustomEvents')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Enable custom events
              </label>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Custom Properties</h4>
            <div className="space-y-2">
              {customProperties.map((prop, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={prop.name}
                    onChange={(e) => {
                      const newProps = [...customProperties];
                      newProps[index].name = e.target.value;
                      setCustomProperties(newProps);
                    }}
                    className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  <select
                    value={prop.type}
                    onChange={(e) => {
                      const newProps = [...customProperties];
                      newProps[index].type = e.target.value as 'string' | 'number' | 'boolean';
                      setCustomProperties(newProps);
                    }}
                    className="focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomProperties(customProperties.filter((_, i) => i !== index));
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setCustomProperties([...customProperties, { name: '', type: 'string' }]);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add Property
              </button>
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

export default AnalyticsIntegration;