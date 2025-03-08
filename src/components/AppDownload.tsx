import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Star, CheckCircle, ArrowDown } from 'lucide-react';

const AppDownload = () => {
  return (
    <section className="section py-20 bg-gray-50 overflow-hidden">
      <div className="container-narrow relative">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Download Our App</h2>
            <p className="text-xl text-gray-600 mb-8">
              Book, manage, and track your cleaning services on the go. Our mobile app makes it easier than ever to keep your home spotless.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Easy Booking</h3>
                  <p className="text-gray-600">Book a cleaning in less than 60 seconds</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Real-time Updates</h3>
                  <p className="text-gray-600">Track your cleaner's arrival and service progress</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Manage Recurring Services</h3>
                  <p className="text-gray-600">Easily schedule weekly or monthly cleanings</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <a href="#" className="flex items-center bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                <div className="mr-3">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </div>
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-xl font-semibold">App Store</div>
                </div>
              </a>
              
              <a href="#" className="flex items-center bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                <div className="mr-3">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
                <div>
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-xl font-semibold">Google Play</div>
                </div>
              </a>
            </div>
            
            <div className="mt-8 flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="ml-2 text-gray-600">4.8 stars on App Store & Google Play</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative mx-auto w-64 h-[500px] bg-black rounded-[40px] shadow-xl overflow-hidden border-[8px] border-black">
              {/* Phone frame */}
              <div className="absolute top-0 inset-x-0">
                <div className="h-6 w-40 bg-black rounded-b-3xl mx-auto"></div>
              </div>
              
              {/* Phone screen */}
              <div className="h-full w-full bg-blue-50 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" 
                  alt="App screenshot" 
                  className="w-full h-full object-cover"
                />
                
                {/* App UI overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70">
                  <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Book Your Cleaning</h3>
                    <p className="text-sm mb-4">Professional cleaners available today</p>
                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Download indicator */}
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full flex items-center animate-bounce">
              <ArrowDown className="mr-2" size={16} />
              <span className="text-sm font-medium">Download Now</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;