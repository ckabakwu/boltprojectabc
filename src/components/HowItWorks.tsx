import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, Home } from 'lucide-react';

const steps = [
  {
    icon: <MapPin className="w-12 h-12 text-blue-600" />,
    title: 'Enter Zip Code & Select Service',
    description: 'Find available cleaners in your area by entering your zip code and choosing the type of cleaning you need.'
  },
  {
    icon: <CreditCard className="w-12 h-12 text-blue-600" />,
    title: 'Book & Pay Securely',
    description: 'Select a convenient date and time, then make a secure payment to confirm your booking.'
  },
  {
    icon: <Home className="w-12 h-12 text-blue-600" />,
    title: 'Relax & Enjoy',
    description: 'A professional cleaner will arrive at your scheduled time. Sit back and enjoy your clean home.'
  }
];

const HowItWorks = () => {
  return (
    <section className="section">
      <div className="container-narrow">
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
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <div className="bg-white p-4 rounded-lg w-full">
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;