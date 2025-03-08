import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Lock, Star, Award, UserCheck } from 'lucide-react';

const SafetyTrust = () => {
  return (
    <section className="section py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container-narrow">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Your Safety Is Our Priority</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We take every precaution to ensure your safety and security when using our services.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-start mb-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Verified Professionals</h3>
                  <p className="text-gray-600">
                    Every cleaner undergoes a thorough background check and identity verification before joining our platform. We only work with the most reliable and trustworthy professionals.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <UserCheck className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Rigorous Screening Process</h3>
                  <p className="text-gray-600">
                    Our multi-step vetting process includes face-to-face interviews, reference checks, and skills assessment to ensure only the best cleaners join our platform.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Quality Assurance</h3>
                  <p className="text-gray-600">
                    We continuously monitor cleaner performance through customer ratings and feedback to maintain our high standards of service.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-start mb-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
                  <p className="text-gray-600">
                    All transactions are processed through our secure payment system. Your financial information is never shared with cleaners or third parties.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <Star className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Trusted by Thousands</h3>
                  <p className="text-gray-600">
                    Join the thousands of satisfied customers who trust HomeMaidy for their home cleaning needs. Our average rating is 4.8 out of 5 stars.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Satisfaction Guarantee</h3>
                  <p className="text-gray-600">
                    Not happy with the cleaning? We'll send another pro to make it right at no extra cost to you. Your satisfaction is our top priority.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-blue-600 text-white rounded-xl shadow-lg p-8 text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Your Peace of Mind is Guaranteed</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Every booking is fully insured and comes with our satisfaction guarantee.
          </p>
          <a href="/booking" className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg shadow-md hover:bg-blue-50 transition-colors">
            Book with Confidence
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default SafetyTrust;