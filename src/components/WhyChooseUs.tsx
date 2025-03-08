import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, UserCheck } from 'lucide-react';

const features = [
  {
    icon: <UserCheck className="w-10 h-10 text-white" />,
    title: 'Vetted & Background-Checked',
    description: 'Every cleaner undergoes a thorough background check and interview process before joining our platform.'
  },
  {
    icon: <Clock className="w-10 h-10 text-white" />,
    title: 'Next-Day & Same-Day Availability',
    description: 'Need a cleaner ASAP? Book today and get your home cleaned as soon as tomorrow.'
  },
  {
    icon: <Shield className="w-10 h-10 text-white" />,
    title: '100% Satisfaction Guarantee',
    description: 'Not satisfied with the cleaning? We\'ll send another pro to make it right at no extra cost.'
  }
];

const WhyChooseUs = () => {
  return (
    <section className="section bg-gray-50 py-20">
      <div className="container-narrow">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Why Choose HomeMaidy</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We're committed to providing the highest quality cleaning services with professionals you can trust.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="bg-blue-600 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 bg-blue-600 text-white p-10 rounded-2xl shadow-xl"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Ready to experience the HomeMaidy difference?</h3>
              <p className="mb-6 text-blue-100">
                Join thousands of satisfied customers who trust HomeMaidy for their cleaning needs.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>5-star rated cleaners</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>Flexible scheduling</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>Transparent pricing</span>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <a href="/booking" className="inline-block bg-white text-blue-600 font-bold py-4 px-8 rounded-lg shadow-md hover:bg-blue-50 transition-colors">
                Book Your Cleaning
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;