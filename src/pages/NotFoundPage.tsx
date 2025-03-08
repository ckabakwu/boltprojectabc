import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container-narrow">
          <div className="text-center max-w-lg mx-auto">
            <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
            <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
            <p className="text-gray-600 mb-8">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="btn btn-primary inline-flex items-center">
              <Home className="mr-2" size={18} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFoundPage;