import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Mail, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const [zipCode, setZipCode] = useState('');
  const [bedrooms, setBedrooms] = useState('1');
  const [bathrooms, setBathrooms] = useState('1');
  const [serviceType, setServiceType] = useState('standard');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/booking?zip=${zipCode}&bedrooms=${bedrooms}&bathrooms=${bathrooms}&service=${serviceType}&email=${email}`);
  };

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Clean living room" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container-narrow relative z-10 pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-[#ffffff]">
            Professional Home Cleaning Services Near You
          </h1>
          <p className="text-xl mb-8 text-[#ffffff] max-w-2xl mx-auto">
            Professional, background-checked cleaners at an affordable price.
          </p>
          
          <div className="hidden md:flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full border-2 border-green-500 bg-transparent flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-[#ffffff]">Vetted professionals</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full border-2 border-green-500 bg-transparent flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-[#ffffff]">Satisfaction guaranteed</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full border-2 border-green-500 bg-transparent flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-[#ffffff]">Secure payments</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter your zip code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                    pattern="[0-9]{5}"
                    maxLength={5}
                  />
                </div>
                
                <div className="relative">
                  <select
                    className="w-full pl-3 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    required
                  >
                    <option value="1">1 bedroom</option>
                    <option value="2">2 bedrooms</option>
                    <option value="3">3 bedrooms</option>
                    <option value="4">4 bedrooms</option>
                    <option value="5">5+ bedrooms</option>
                    <option value="0">Studio</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
                
                <div className="relative">
                  <select
                    className="w-full pl-3 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    required
                  >
                    <option value="1">1 bathroom</option>
                    <option value="1.5">1.5 bathrooms</option>
                    <option value="2">2 bathrooms</option>
                    <option value="2.5">2.5 bathrooms</option>
                    <option value="3">3 bathrooms</option>
                    <option value="3.5">3.5+ bathrooms</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <select
                    className="w-full pl-3 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    required
                  >
                    <option value="standard">Standard Cleaning</option>
                    <option value="deep">Deep Cleaning</option>
                    <option value="move">Move In/Out Cleaning</option>
                    <option value="airbnb">Airbnb Cleaning</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
                
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full py-2 px-6 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-all duration-300 flex items-center justify-center whitespace-nowrap"
                >
                  Get a Price
                  <ArrowRight className="ml-2" size={18} />
                </button>
              </div>
            </form>
            
            <div className="bg-gray-50 p-3 border-t border-gray-200 rounded-b-xl">
              <div className="flex items-center justify-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">4.8/5 from 10,000+ reviews</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Spacer div to maintain height */}
        <div className="h-32"></div>
      </div>
    </section>
  );
};

export default HeroSection;