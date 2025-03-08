import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Phone } from 'lucide-react';

const DashboardFooter: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link to="/customer-dashboard" className="flex items-center space-x-2">
              <div className="bg-blue-600 rounded-full p-1.5">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-700">HomeMaidy</span>
            </Link>
            <span className="text-gray-500 text-sm ml-4">
              &copy; {new Date().getFullYear()} HomeMaidy. All rights reserved.
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <div className="flex items-center text-gray-500 text-sm">
              <Mail className="h-4 w-4 mr-1" />
              <a href="mailto:support@homemaidy.com" className="hover:text-blue-600">
                support@homemaidy.com
              </a>
            </div>
            
            <div className="flex items-center text-gray-500 text-sm">
              <Phone className="h-4 w-4 mr-1" />
              <a href="tel:+18001234567" className="hover:text-blue-600">
                (800) 123-4567
              </a>
            </div>
            
            <div className="flex space-x-4 text-sm">
              <Link to="/privacy" className="text-gray-500 hover:text-blue-600">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-blue-600">
                Terms of Service
              </Link>
              <Link to="/help" className="text-gray-500 hover:text-blue-600">
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;