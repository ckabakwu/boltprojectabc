import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  MapPin, 
  Edit2, 
  Trash2, 
  Upload, 
  Download,
  Filter,
  ChevronDown
} from 'lucide-react';
import ServiceAreaMap from '../../components/ServiceAreaMap';
import { supabase } from '../../lib/supabase';
import type { ServiceArea } from '../../lib/supabase';

const AdminServiceAreasPage = () => {
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadServiceAreas();
  }, []);

  const loadServiceAreas = async () => {
    try {
      const { data, error } = await supabase
        .from('service_locations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServiceAreas(data || []);
    } catch (err) {
      setError('Failed to load service areas');
      console.error('Error loading service areas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAreaCreate = async (geometry: any) => {
    try {
      const { error } = await supabase
        .from('service_locations')
        .insert([{
          name: 'New Service Area',
          type: 'custom',
          boundary: geometry
        }]);

      if (error) throw error;
      loadServiceAreas();
    } catch (err) {
      setError('Failed to create service area');
      console.error('Error creating service area:', err);
    }
  };

  const handleAreaUpdate = async (id: string, geometry: any) => {
    try {
      const { error } = await supabase
        .from('service_locations')
        .update({ boundary: geometry })
        .eq('id', id);

      if (error) throw error;
      loadServiceAreas();
    } catch (err) {
      setError('Failed to update service area');
      console.error('Error updating service area:', err);
    }
  };

  const handleAreaDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('service_locations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadServiceAreas();
    } catch (err) {
      setError('Failed to delete service area');
      console.error('Error deleting service area:', err);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = JSON.parse(e.target?.result as string);
        const { error } = await supabase
          .from('service_locations')
          .insert(data);

        if (error) throw error;
        loadServiceAreas();
      };
      reader.readAsText(file);
    } catch (err) {
      setError('Failed to import service areas');
      console.error('Error importing service areas:', err);
    }
  };

  const handleExport = async () => {
    try {
      const { data, error } = await supabase
        .from('service_locations')
        .select('*');

      if (error) throw error;

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'service-areas.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export service areas');
      console.error('Error exporting service areas:', err);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Service Areas</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and configure service coverage areas.
        </p>
      </div>

      {/* Search and Actions */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search service areas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter className="h-5 w-5 mr-2 text-gray-400" />
                Filter
                <ChevronDown className="ml-2 h-5 w-5 text-gray-400" />
              </button>
              
              {filterOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setSelectedType('all')}
                    >
                      All Types
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setSelectedType('zipcode')}
                    >
                      Zip Code
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setSelectedType('city')}
                    >
                      City
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setSelectedType('radius')}
                    >
                      Radius
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setSelectedType('custom')}
                    >
                      Custom
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <label className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                <Upload className="h-5 w-5 mr-2 text-gray-400" />
                Import
                <input
                  type="file"
                  className="hidden"
                  accept=".json"
                  onChange={handleImport}
                />
              </label>
              
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="h-5 w-5 mr-2 text-gray-400" />
                Export
              </button>
              
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Area
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map and List View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map View */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Service Area Map</h2>
            <div className="h-[600px]">
              <ServiceAreaMap
                serviceAreas={serviceAreas}
                onAreaCreate={handleAreaCreate}
                onAreaUpdate={handleAreaUpdate}
                editable={true}
              />
            </div>
          </div>
        </div>

        {/* List View */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Service Areas List</h2>
            <div className="space-y-4">
              {serviceAreas.map((area) => (
                <div
                  key={area.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{area.name}</h3>
                        <p className="text-sm text-gray-500">Type: {area.type}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {/* Implement edit */}}
                        className="p-1 text-gray-400 hover:text-gray-500"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleAreaDelete(area.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminServiceAreasPage;