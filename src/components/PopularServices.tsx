import React from 'react';
import { motion } from 'framer-motion';
import { Sparkle, Building, Chrome as Broom } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: <Broom className="w-12 h-12 text-blue-600" />,
    title: 'Home Cleaning',
    description: 'Professional cleaning for your entire home',
    link: '/services/home-cleaning'
  },
  {
    icon: <Building className="w-12 h-12 text-blue-600" />,
    title: 'Airbnb/Rental Cleaning',
    description: 'Quick turnaround cleaning for rental properties',
    link: '/services/airbnb-cleaning'
  },
  {
    icon: <Building className="w-12 h-12 text-blue-600" />,
    title: 'Office Cleaning',
    description: 'Keep your workspace clean and professional',
    link: '/services/office-cleaning'
  }
];

const PopularServices = () => {
  return (
    <section className="section bg-white">
      <div className="container-narrow">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Popular Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Professional cleaning services tailored to your needs. Book in minutes.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">{service.title}</h3>
                <p className="text-gray-600 text-center mb-6">{service.description}</p>
                <div className="text-center">
                  <Link to={service.link} className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                    Learn more
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularServices;