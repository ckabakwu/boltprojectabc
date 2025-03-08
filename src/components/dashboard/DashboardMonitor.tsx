import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  BarChart2,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';

interface ComponentStatus {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'error';
  lastChecked: Date;
  errorMessage?: string;
  dependencies: string[];
}

const DashboardMonitor: React.FC = () => {
  const [components, setComponents] = useState<ComponentStatus[]>([
    {
      id: 'earnings-chart',
      name: 'Earnings Chart',
      status: 'healthy',
      lastChecked: new Date(),
      dependencies: ['date-fns', 'framer-motion']
    },
    {
      id: 'schedule-calendar',
      name: 'Schedule Calendar',
      status: 'healthy',
      lastChecked: new Date(),
      dependencies: ['date-fns']
    },
    {
      id: 'service-area-map',
      name: 'Service Area Map',
      status: 'healthy',
      lastChecked: new Date(),
      dependencies: ['mapbox-gl', 'react-map-gl', '@turf/turf']
    },
    {
      id: 'analytics-widget',
      name: 'Analytics Widget',
      status: 'healthy',
      lastChecked: new Date(),
      dependencies: ['framer-motion']
    }
  ]);

  const [isChecking, setIsChecking] = useState(false);

  const checkComponent = async (component: ComponentStatus): Promise<ComponentStatus> => {
    // Simulate component health check
    return new Promise((resolve) => {
      setTimeout(() => {
        const hasMissingDependencies = component.dependencies.some(dep => {
          try {
            require(dep);
            return false;
          } catch {
            return true;
          }
        });

        resolve({
          ...component,
          status: hasMissingDependencies ? 'error' : 'healthy',
          lastChecked: new Date(),
          errorMessage: hasMissingDependencies ? 'Missing required dependencies' : undefined
        });
      }, 500);
    });
  };

  const checkAllComponents = async () => {
    setIsChecking(true);
    
    const updatedComponents = await Promise.all(
      components.map(component => checkComponent(component))
    );
    
    setComponents(updatedComponents);
    setIsChecking(false);
  };

  useEffect(() => {
    checkAllComponents();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getComponentIcon = (name: string) => {
    if (name.includes('Chart')) return <BarChart2 className="h-5 w-5" />;
    if (name.includes('Calendar')) return <Activity className="h-5 w-5" />;
    if (name.includes('Map')) return <PieChart className="h-5 w-5" />;
    return <LineChart className="h-5 w-5" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Dashboard Components</h2>
          <button
            onClick={checkAllComponents}
            disabled={isChecking}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Checking...' : 'Check All'}
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {components.map((component) => (
          <motion.div
            key={component.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gray-100 rounded-lg p-2 mr-4">
                  {getComponentIcon(component.name)}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {component.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Last checked: {component.lastChecked.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                {getStatusIcon(component.status)}
                <span className={`ml-2 text-sm ${
                  component.status === 'healthy' ? 'text-green-800' :
                  component.status === 'warning' ? 'text-yellow-800' :
                  'text-red-800'
                }`}>
                  {component.status.charAt(0).toUpperCase() + component.status.slice(1)}
                </span>
              </div>
            </div>

            {component.errorMessage && (
              <div className="mt-2 text-sm text-red-600">
                Error: {component.errorMessage}
              </div>
            )}

            <div className="mt-2">
              <h4 className="text-xs font-medium text-gray-500">Dependencies</h4>
              <div className="mt-1 flex flex-wrap gap-2">
                {component.dependencies.map((dep) => (
                  <span
                    key={dep}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            Total Components: {components.length}
          </div>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              {components.filter(c => c.status === 'healthy').length} Healthy
            </div>
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
              {components.filter(c => c.status === 'warning').length} Warning
            </div>
            <div className="flex items-center">
              <XCircle className="h-4 w-4 text-red-500 mr-1" />
              {components.filter(c => c.status === 'error').length} Error
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMonitor;