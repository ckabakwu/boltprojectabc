import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, CheckCircle, Phone, Mail, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Mock data for locations
const locations = [
  {
    city: 'Dallas',
    state: 'TX',
    description: 'Professional home cleaning services in Dallas, TX and surrounding areas including Plano, Frisco, Richardson, and more. Our Dallas team serves the entire metroplex with reliable, high-quality cleaning services for homes and businesses.',
    image: 'https://images.unsplash.com/photo-1545194445-dddb8f4487c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    neighborhoods: ['Uptown', 'Downtown', 'Highland Park', 'University Park', 'Oak Lawn', 'Deep Ellum', 'Bishop Arts District', 'Knox-Henderson', 'Lakewood', 'Preston Hollow', 'Turtle Creek', 'Greenville Avenue', 'Design District'],
    zipCodes: ['75201', '75202', '75203', '75204', '75205', '75206', '75207', '75208', '75209', '75210', '75211', '75212', '75214', '75215', '75218', '75219', '75220', '75225', '75226', '75228', '75229', '75230', '75231', '75235', '75238', '75240', '75243', '75244', '75248', '75251', '75252', '75254'],
    suburbs: ['Plano', 'Frisco', 'Richardson', 'Allen', 'McKinney', 'Garland', 'Irving', 'Carrollton', 'Addison', 'Farmers Branch', 'Lewisville', 'Coppell', 'Flower Mound', 'Grapevine', 'Southlake']
  },
  // ... other locations ...
];

const ServiceAreasPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Service Areas | HomeMaidy';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-28 pb-16">
        <div className="container-narrow">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Our Service Areas</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              HomeMaidy provides professional cleaning services in major cities across the United States. Find your location below to book a cleaning service today.
            </p>
          </motion.div>
          
          {locations.map((location, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden mb-10"
            >
              <div className="grid md:grid-cols-2 gap-0">
                <div className="h-64 md:h-auto overflow-hidden">
                  <img 
                    src={location.image} 
                    alt={`${location.city}, ${location.state}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-start mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{location.city}, {location.state}</h2>
                      <p className="text-gray-600 mt-2">{location.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <Link 
                      to={`/booking?city=${location.city}&state=${location.state}`}
                      className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                    >
                      Book a cleaning in {location.city}
                      <ArrowRight className="ml-2" size={16} />
                    </Link>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {location.zipCodes.length}+ zip codes served
                    </span>
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      {location.neighborhoods.length}+ neighborhoods
                    </span>
                    <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                      {location.suburbs.length}+ surrounding areas
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 px-8 py-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Popular Neighborhoods</h3>
                    <div className="flex flex-wrap gap-2">
                      {location.neighborhoods.slice(0, 8).map((neighborhood, i) => (
                        <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {neighborhood}
                        </span>
                      ))}
                      {location.neighborhoods.length > 8 && (
                        <span className="text-gray-500 text-sm flex items-center">
                          +{location.neighborhoods.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Service Zip Codes</h3>
                    <div className="flex flex-wrap gap-2">
                      {location.zipCodes.slice(0, 10).map((zipCode, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {zipCode}
                        </span>
                      ))}
                      {location.zipCodes.length > 10 && (
                        <span className="text-gray-500 text-sm flex items-center">
                          +{location.zipCodes.length - 10} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Surrounding Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {location.suburbs.slice(0, 8).map((suburb, i) => (
                        <span key={i} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                          {suburb}
                        </span>
                      ))}
                      {location.suburbs.length > 8 && (
                        <span className="text-gray-500 text-sm flex items-center">
                          +{location.suburbs.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
                <div className="flex flex-wrap justify-between items-center">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Same-day and next-day appointments available</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Phone className="w-4 h-4 mr-1" />
                    <span>Local support: (800) 123-4567</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Don't See Your Area?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We're constantly expanding our service areas. Contact us to check if we can accommodate your location or to request service in your area. We're adding new cities and neighborhoods regularly!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn btn-primary">
                Contact Us
              </Link>
              <a href="tel:+18001234567" className="btn btn-secondary flex items-center">
                <Phone className="mr-2" size={18} />
                (800) 123-4567
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ServiceAreasPage;