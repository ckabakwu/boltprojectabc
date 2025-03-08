import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';

const FinalCTA = () => {
  const [zipCode, setZipCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/booking?zip=${zipCode}`);
  };

  return (
    <section className="section py-12 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white"></div>
        <div className="absolute top-20 right-10 w-20 h-20 rounded-full bg-white"></div>
        <div className="absolute bottom-10 left-1/4 w-32 h-32 rounded-full bg-white"></div>
        <div className="absolute -bottom-10 right-1/3 w-48 h-48 rounded-full bg-white"></div>
      </div>
      
      <div className="container-narrow relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-white mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for a Spotless Home?</h2>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Book your cleaning service today and enjoy a clean, fresh home without the hassle.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md mx-auto"
        >
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <MapPin className="absolute left-3 top-3.5 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Enter your zip code"
                className="input-field pl-10 w-full rounded-lg"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
                pattern="[0-9]{5}"
                maxLength={5}
              />
            </div>
            <button 
              type="submit" 
              className="btn bg-white text-blue-600 hover:bg-blue-50 flex items-center justify-center"
            >
              Book Now
              <ArrowRight className="ml-2" size={18} />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;