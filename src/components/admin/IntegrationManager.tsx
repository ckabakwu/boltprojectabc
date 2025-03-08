import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Plus, RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { integrationHub, type IntegrationConfig } from '../../lib/integrationHub';

const IntegrationManager: React.FC = () => {
  const [configs, setConfigs] = useState<IntegrationConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<IntegrationConfig | null>(null);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      await integrationHub.loadConfigs();
      setConfigs(Array.from(integrationHub.getActiveConfigs()));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async (config: IntegrationConfig) => {
    try {
      await integrationHub.testConnection(config);
      await loadConfigs();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveConfig = async (config: IntegrationConfig) => {
    try {
      await integrationHub.saveConfig(config);
      await loadConfigs();
      setShowAddForm(false);
      setSelectedConfig(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteConfig = async (id: string) => {
    try {
      await integrationHub.deleteConfig(id);
      await loadConfigs();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Integration Manager</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Integration
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {configs.map((config) => (
          <motion.div
            key={config.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Settings className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium">{config.name}</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                config.status === 'active' 
                  ? 'bg-green-100 text-green-800'
                  : config.status === 'error'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {config.status}
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Type: {config.type}
            </p>

            {config.lastChecked && (
              <p className="text-xs text-gray-500 mb-4">
                Last checked: {new Date(config.lastChecked).toLocaleString()}
              </p>
            )}

            {config.errorMessage && (
              <div className="mb-4 p-2 bg-red-50 rounded-md">
                <p className="text-xs text-red-700">{config.errorMessage}</p>
              </div>
            )}

            <div className="flex space-x-2">
              <button
                onClick={() => handleTestConnection(config)}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Test
              </button>
              <button
                onClick={() => setSelectedConfig(config)}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </button>
              <button
                onClick={() => handleDeleteConfig(config.id)}
                className="flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Remove
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Integration Modal */}
      {(showAddForm || selectedConfig) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-lg w-full mx-4"
          >
            <h3 className="text-lg font-medium mb-4">
              {selectedConfig ? 'Edit Integration' : 'Add Integration'}
            </h3>
            
            {/* Integration form will go here */}
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedConfig(null);
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle save
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default IntegrationManager;