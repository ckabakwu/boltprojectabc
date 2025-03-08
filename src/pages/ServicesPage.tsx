import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  Home, 
  Building, 
  Briefcase, 
  Calendar, 
  CreditCard, 
  Shield, 
  Star 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ServicesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Professional Cleaning Services | HomeMaidy';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Professional cleaner working" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10 pt-10 pb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Premium Home Cleaning Services, Just a Click Away
            </h1>
            <p className="text-lg mb-6 max-w-3xl mx-auto">
              Trusted, vetted professionals ready to clean your home when you need it.
            </p>
            <Link 
              to="/booking" 
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg"
            >
              Book Now
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Services List Section */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Our Cleaning Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a variety of cleaning services to meet your needs. All services include our satisfaction guarantee and are performed by our vetted, professional cleaners.
            </p>
          </motion.div>
          
          <div className="space-y-12">
            {/* Standard Cleaning */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-2/3">
                    <div className="flex items-center mb-4">
                      <Sparkles className="w-8 h-8 text-blue-600 mr-3" />
                      <h3 className="text-2xl font-bold">Standard Cleaning</h3>
                    </div>
                    
                    <p className="text-gray-700 mb-6">
                      A perfect solution for maintaining a clean and tidy home. Our standard cleaning service covers all the essentials to keep your space fresh and inviting.
                    </p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-lg mb-3">Includes:</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Dusting all accessible surfaces</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Vacuuming all floors and carpets</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Mopping all hard floors</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Cleaning kitchen counters and appliance exteriors</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Cleaning bathroom fixtures and surfaces</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Emptying trash bins</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Making beds (linens must be provided)</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>General tidying and straightening</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Great for:</h4>
                        <p className="text-gray-600">Routine cleaning and upkeep</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Estimated Duration:</h4>
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="text-gray-600">2-3 hours (varies by home size)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/3 flex flex-col justify-between">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="font-semibold text-lg mb-3">Pricing</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Studio/1 Bedroom:</span>
                          <span className="font-semibold">$99</span>
                        </div>
                        <div className="flex justify-between">
                          <span>2 Bedroom:</span>
                          <span className="font-semibold">$119</span>
                        </div>
                        <div className="flex justify-between">
                          <span>3 Bedroom:</span>
                          <span className="font-semibold">$139</span>
                        </div>
                        <div className="flex justify-between">
                          <span>4+ Bedroom:</span>
                          <span className="font-semibold">$159+</span>
                        </div>
                        <div className="pt-3 text-sm text-gray-600">
                          *Prices may vary based on home condition and specific requirements
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      to="/booking?service=standard" 
                      className="mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium text-center hover:bg-blue-700 transition-colors"
                    >
                      Book Standard Cleaning
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Deep Cleaning */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-2/3">
                    <div className="flex items-center mb-4">
                      <Sparkles className="w-8 h-8 text-blue-600 mr-3" />
                      <h3 className="text-2xl font-bold">Deep Cleaning</h3>
                    </div>
                    
                    <p className="text-gray-700 mb-6">
                      An intensive cleaning session for a spotless home. Our deep cleaning service tackles built-up dirt and grime in areas that are often overlooked during regular cleaning.
                    </p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-lg mb-3">Includes:</h4>
                      <p className="text-gray-600 mb-3">Everything in Standard Cleaning plus:</p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Cleaning baseboards and door frames</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Cleaning interior windows and sills</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Cleaning inside kitchen cabinets</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Detailed kitchen appliance cleaning</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Scrubbing bathroom tile and grout</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Cleaning light fixtures and ceiling fans</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Detailed dusting of blinds and vents</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Extra attention to high-traffic areas</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Great for:</h4>
                        <p className="text-gray-600">Homes that need extra care or haven't been cleaned in a while</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Estimated Duration:</h4>
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="text-gray-600">4-6 hours (varies by home size)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/3 flex flex-col justify-between">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="font-semibold text-lg mb-3">Pricing</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Studio/1 Bedroom:</span>
                          <span className="font-semibold">$179</span>
                        </div>
                        <div className="flex justify-between">
                          <span>2 Bedroom:</span>
                          <span className="font-semibold">$209</span>
                        </div>
                        <div className="flex justify-between">
                          <span>3 Bedroom:</span>
                          <span className="font-semibold">$239</span>
                        </div>
                        <div className="flex justify-between">
                          <span>4+ Bedroom:</span>
                          <span className="font-semibold">$269+</span>
                        </div>
                        <div className="pt-3 text-sm text-gray-600">
                          *Prices may vary based on home condition and specific requirements
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      to="/booking?service=deep" 
                      className="mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium text-center hover:bg-blue-700 transition-colors"
                    >
                      Book Deep Cleaning
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Move-In/Move-Out Cleaning */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-2/3">
                    <div className="flex items-center mb-4">
                      <Home className="w-8 h-8 text-blue-600 mr-3" />
                      <h3 className="text-2xl font-bold">Move-In/Move-Out Cleaning</h3>
                    </div>
                    
                    <p className="text-gray-700 mb-6">
                      Ensure your new or previous home is fresh and spotless. Our move-in/move-out cleaning is a comprehensive service designed to prepare a home for new occupants or help you leave your current place in perfect condition.
                    </p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-lg mb-3">Includes:</h4>
                      <p className="text-gray-600 mb-3">Everything in Deep Cleaning plus:</p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Cleaning inside all cabinets and drawers</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Cleaning inside refrigerator and freezer</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Cleaning inside oven and microwave</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Full bathroom sanitization</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Cleaning inside closets</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Removing cobwebs from ceilings and corners</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Cleaning all switch plates and door handles</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Spot cleaning walls and doors</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Great for:</h4>
                        <p className="text-gray-600">Moving in or out of a home, end of lease cleaning</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Estimated Duration:</h4>
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="text-gray-600">5-7 hours (varies by home size)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/3 flex flex-col justify-between">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="font-semibold text-lg mb-3">Pricing</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Studio/1 Bedroom:</span>
                          <span className="font-semibold">$229</span>
                        </div>
                        <div className="flex justify-between">
                          <span>2 Bedroom:</span>
                          <span className="font-semibold">$269</span>
                        </div>
                        <div className="flex justify-between">
                          <span>3 Bedroom:</span>
                          <span className="font-semibold">$309</span>
                        </div>
                        <div className="flex justify-between">
                          <span>4+ Bedroom:</span>
                          <span className="font-semibold">$349+</span>
                        </div>
                        <div className="pt-3 text-sm text-gray-600">
                          *Prices may vary based on home condition and specific requirements
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      to="/booking?service=move" 
                      className="mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium text-center hover:bg-blue-700 transition-colors"
                    >
                      Book Move-In/Out Cleaning
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Short-Term Rental & Airbnb Cleaning */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-2/3">
                    <div className="flex items-center mb-4">
                      <Building className="w-8 h-8 text-blue-600 mr-3" />
                      <h3 className="text-2xl font-bold">Short-Term Rental & Airbnb Cleaning</h3>
                    </div>
                    
                    <p className="text-gray-700 mb-6">
                      Quick turnaround cleaning for rental properties. Our specialized service ensures your rental property is pristine and ready for the next guest, helping you maintain your high ratings.
                    </p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-lg mb-3">Includes:</h4>
                      <p className="text-gray-600 mb-3">Standard Cleaning plus:</p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Changing bed linens and making beds</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Replacing towels and washcloths</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Restocking toiletries and essentials</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Sanitizing high-touch surfaces</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Checking for and reporting damages</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Arranging welcome items</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Taking property photos (upon request)</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Staging for the next guest</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Great for:</h4>
                        <p className="text-gray-600">Airbnb hosts and rental property owners</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Estimated Duration:</h4>
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="text-gray-600">2-4 hours (varies by property size)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/3 flex flex-col justify-between">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="font-semibold text-lg mb-3">Pricing</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Studio/1 Bedroom:</span>
                          <span className="font-semibold">$129</span>
                        </div>
                        <div className="flex justify-between">
                          <span>2 Bedroom:</span>
                          <span className="font-semibold">$149</span>
                        </div>
                        <div className="flex justify-between">
                          <span>3 Bedroom:</span>
                          <span className="font-semibold">$179</span>
                        </div>
                        <div className="flex justify-between">
                          <span>4+ Bedroom:</span>
                          <span className="font-semibold">$209+</span>
                        </div>
                        <div className="pt-3 text-sm text-gray-600">
                          *Discounts available for recurring bookings
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      to="/booking?service=airbnb" 
                      className="mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium text-center hover:bg-blue-700 transition-colors"
                    >
                      Book Rental Cleaning
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Office Cleaning */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-2/3">
                    <div className="flex items-center mb-4">
                      <Briefcase className="w-8 h-8 text-blue-600 mr-3" />
                      <h3 className="text-2xl font-bold">Office Cleaning</h3>
                    </div>
                    
                    <p className="text-gray-700 mb-6">
                      Keep your workspace clean and professional. Our office cleaning service is designed to maintain a healthy, productive environment for your team and impress your clients.
                    </p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-lg mb-3">Includes:</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Dusting and wiping all surfaces</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Vacuuming carpets and floors</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Mopping hard floors</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Cleaning and sanitizing bathrooms</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Cleaning kitchen/break areas</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Emptying trash bins</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Cleaning glass surfaces and partitions</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Sanitizing high-touch areas</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Great for:</h4>
                        <p className="text-gray-600">Small to medium offices, co-working spaces, retail shops</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Estimated Duration:</h4>
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="text-gray-600">2-5 hours (varies by office size)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/3 flex flex-col justify-between">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="font-semibold text-lg mb-3">Pricing</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Up to 1,000 sq ft:</span>
                          <span className="font-semibold">$149</span>
                        </div>
                        <div className="flex justify-between">
                          <span>1,000-2,000 sq ft:</span>
                          <span className="font-semibold">$199</span>
                        </div>
                        <div className="flex justify-between">
                          <span>2,000-3,000 sq ft:</span>
                          <span className="font-semibold">$249</span>
                        </div>
                        <div className="flex justify-between">
                          <span>3,000+ sq ft:</span>
                          <span className="font-semibold">Custom quote</span>
                        </div>
                        <div className="pt-3 text-sm text-gray-600">
                          *Discounts available for recurring service contracts
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      to="/booking?service=office" 
                      className="mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium text-center hover:bg-blue-700 transition-colors"
                    >
                      Book Office Cleaning
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Booking a cleaning service has never been easier. Just follow these simple steps.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-blue-200 z-0"></div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mb-6 shadow-lg">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm w-full">
                <h3 className="text-xl font-semibold mb-3">Choose Your Service</h3>
                <p className="text-gray-600">Pick the cleaning option that fits your needs and schedule.</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mb-6 shadow-lg">
                <CreditCard className="w-8 h-8" />
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm w-full">
                <h3 className="text-xl font-semibold mb-3">Book & Pay Securely</h3>
                <p className="text-gray-600">Select a date, confirm your booking, and pay online with confidence.</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mb-6 shadow-lg">
                <Home className="w-8 h-8" />
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm w-full">
                <h3 className="text-xl font-semibold mb-3">Get a Spotless Home</h3>
                <p className="text-gray-600">A professional cleaner arrives at your scheduled time. Relax and enjoy.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Our Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Services?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing exceptional cleaning services with professionals you can trust.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-50 p-6 rounded-xl"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Background-Checked Professionals</h3>
              <p className="text-gray-600">
                Every cleaner undergoes a thorough background check and identity verification before joining our platform. Your safety is our priority.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-50 p-6 rounded-xl"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Same-Day & Next-Day Availability</h3>
              <p className="text-gray-600">
                Need a cleaner ASAP? We offer flexible scheduling with same-day and next-day options to accommodate your busy lifestyle.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gray-50 p-6 rounded-xl"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">100% Satisfaction Guarantee</h3>
              <p className="text-gray-600">
                Not satisfied with the cleaning? We'll send another pro to make it right at no extra cost. Your happiness is guaranteed.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers have to say about our cleaning services.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-xl shadow-md"
          >
            <div className="flex justify-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            
            <p className="text-gray-700 text-lg italic mb-6 text-center">
              "I've been using HomeMaidy for over a year now and I couldn't be happier. The cleaners are always professional, thorough, and friendly. My home has never looked better!"
            </p>
            
            <div className="text-center">
              <p className="font-semibold text-lg">Sarah Johnson</p>
              <p className="text-gray-500">New York, NY</p>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Call-to-Action Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Ready for a Spotless Home?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Book your cleaning service today and enjoy a clean, fresh home without the hassle.
            </p>
            <Link 
              to="/booking" 
              className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-medium text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              Book Now
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ServicesPage;