import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Key, Settings, Globe } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const mapboxConfigSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  style: z.string().min(1, 'Map style is required'),
  defaultZoom: z.number().min(0).max(22),
  defaultCenter: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180)
  }),
  geocodingEnabled: z.boolean(),
  navigationEnabled: z.boolean(),
  usageLimit: z.number().min(0)
});

const MapIntegration: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(mapboxConfigSchema),
    defaultValues: {
      defaultZoom: 12,
      defaultCenter: { lat: 0, lng: 0 },
      usageLimit: 50000
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
          <div className="bg-green-100 p-3 rounded-lg">
            <Map className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium">Mapping & Location Services</h3>
            <p className="text-sm text-gray-500">Configure Mapbox integration</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mapbox Access Token
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                {...register('accessToken')}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="pk.eyJ1..."
              />
            </div>
            {errors.accessToken && (
              <p className="mt-1 text-sm text-red-600">{errors.accessToken.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Map Style URL
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                {...register('style')}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="mapbox://styles/mapbox/streets-v11"
              />
            </div>
            {errors.style && (
              <p className="mt-1 text-sm text-red-600">{errors.style.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Default Latitude
              </label>
              <input
                type="number"
                step="any"
                {...register('defaultCenter.lat')}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              {errors.defaultCenter?.lat && (
                <p className="mt-1 text-sm text-red-600">{errors.defaultCenter.lat.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Default Longitude
              </label>
              <input
                type="number"
                step="any"
                {...register('defaultCenter.lng')}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              {errors.defaultCenter?.lng && (
                <p className="mt-1 text-sm text-red-600">{errors.defaultCenter.lng.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Default Zoom Level
            </label>
            <input
              type="number"
              {...register('defaultZoom')}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              min="0"
              max="22"
            />
            {errors.defaultZoom && (
              <p className="mt-1 text-sm text-red-600">{errors.defaultZoom.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Monthly Usage Limit
            </label>
            <input
              type="number"
              {...register('usageLimit')}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              min="0"
            />
            {errors.usageLimit && (
              <p className="mt-1 text-sm text-red-600">{errors.usageLimit.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('geocodingEnabled')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Enable geocoding service
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('navigationEnabled')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Enable navigation controls
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

export default MapIntegration;