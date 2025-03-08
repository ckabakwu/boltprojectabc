import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { adminService } from '../../lib/adminService';

const AdminDataExport: React.FC = () => {
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const [exportSuccess, setExportSuccess] = useState(false);

  const tables = [
    'users',
    'bookings',
    'service_providers',
    'service_areas',
    'reviews',
    'payments',
    'notifications'
  ];

  const handleExport = async () => {
    if (selectedTables.length === 0) {
      setExportError('Please select at least one table to export');
      return;
    }

    setIsExporting(true);
    setExportError('');
    setExportSuccess(false);

    try {
      const data = await adminService.exportData(selectedTables);
      
      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `homemaidy_export_${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setExportSuccess(true);
    } catch (error) {
      setExportError(error.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Export Data</h2>
        
        {exportError && (
          <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {exportError}
          </div>
        )}

        {exportSuccess && (
          <div className="mb-4 bg-green-50 text-green-600 p-4 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Data exported successfully
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Tables to Export
            </label>
            <div className="grid grid-cols-2 gap-4">
              {tables.map((table) => (
                <label key={table} className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={selectedTables.includes(table)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTables([...selectedTables, table]);
                      } else {
                        setSelectedTables(selectedTables.filter(t => t !== table));
                      }
                    }}
                  />
                  <span className="ml-2 text-gray-700 capitalize">
                    {table.replace(/_/g, ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setSelectedTables(tables)}
            >
              Select All
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleExport}
              disabled={isExporting || selectedTables.length === 0}
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDataExport;