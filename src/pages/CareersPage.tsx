import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  Heart, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Award, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const openPositions = [
  {
    title: 'Cleaning Professional',
    type: 'Full-time / Part-time',
    location: 'Multiple Locations',
    description: 'Join our team of cleaning professionals to provide exceptional service to our customers.'
  },
  {
    title: 'Customer Support Specialist',
    type: 'Full-time',
    location: 'Remote',
    description: 'Help our customers have the best experience with HomeMaidy through excellent support.'
  },
  {
    title: 'Operations Manager',
    type: 'Full-time',
    location: 'Dallas, TX',
    description: 'Oversee daily operations and ensure smooth service delivery in the Dallas area.'
  },
  {
    title: 'Marketing Specialist',
    type: 'Full-time',
    location: 'Austin, TX',
    description: 'Drive growth through digital marketing campaigns and customer acquisition strategies.'
  },
  {
    title: 'Software Engineer',
    type: 'Full-time',
    location: 'Remote',
    description: 'Build and maintain the technology that powers our platform and customer experience.'
  }
];

const benefits = [
  {
    icon: <DollarSign className="w-6 h-6 text-blue-600" />,
    title: 'Competitive Pay',
    description: 'We offer above-industry compensation packages with regular performance reviews.'
  },
  {
    icon: <Heart className="w-6 h-6 text-blue-600" />,
    title: 'Health Benefits',
    description: 'Comprehensive health, dental, and vision insurance for full-time employees.'
  },
  {
    icon: <Clock className="w-6 h-6 text-blue-600" />,
    title: 'Flexible Scheduling',
    description: 'Work-life balance is important to us, with flexible hours and remote options where possible.'
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
    title: 'Growth Opportunities',
    description: 'Clear career paths and professional development to help you advance.'
  },
  {
    icon: <Award className="w-6 h-6 text-blue-600" />,
    title: 'Recognition Programs',
    description: 'Regular recognition for outstanding performance and contributions.'
  },
  {
    icon: <Users className="w-6 h-6 text-blue-600" />,
    title: 'Inclusive Culture',
    description: 'A diverse and supportive workplace where everyone belongs.'
  }
];

const CareersPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Careers | HomeMaidy';
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
            <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              At HomeMaidy, we're building the future of home services. Join our team of passionate individuals dedicated to making homes cleaner and lives easier.
            </p>
          </motion.div>
          
          {/* Why Work With Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Why Work With Us</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      {benefit.icon}
                    </div>
                    <h3 className="font-semibold text-lg">{benefit.title}</h3>
                  </div>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Open Positions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Open Positions</h2>
            
            <div className="space-y-4">
              {openPositions.map((position, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <Briefcase className="w-5 h-5 text-blue-600 mr-2" />
                        <h3 className="font-bold text-xl">{position.title}</h3>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center text-gray-600 mb-4 md:mb-0">
                        <span className="mr-4">{position.type}</span>
                        <span className="hidden md:inline-block mx-2">•</span>
                        <span>{position.location}</span>
                      </div>
                      <p className="text-gray-700 mt-2 md:mt-0">{position.description}</p>
                    </div>
                    <Link 
                      to={`/careers/${position.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="mt-4 md:mt-0 inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                    >
                      View Details
                      <ArrowRight className="ml-2" size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Our Hiring Process */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Our Hiring Process</h2>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="relative pl-8 pb-8 border-l-2 border-blue-200">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                    <h3 className="font-semibold text-lg mb-2">1. Application Review</h3>
                    <p className="text-gray-600">We review your application and resume to assess your qualifications and experience.</p>
                  </div>
                  
                  <div className="relative pl-8 pb-8 border-l-2 border-blue-200">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                    <h3 className="font-semibold text-lg mb-2">2. Initial Interview</h3>
                    <p className="text-gray-600">A phone or video call to discuss your background, skills, and interest in the role.</p>
                  </div>
                  
                  <div className="relative pl-8">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                    <h3 className="font-semibold text-lg mb-2">3. Skills Assessment</h3>
                    <p className="text-gray-600">Depending on the role, we may ask you to complete a skills assessment or practical demonstration.</p>
                  </div>
                </div>
                
                <div>
                  <div className="relative pl-8 pb-8 border-l-2 border-blue-200">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                    <h3 className="font-semibold text-lg mb-2">4. Team Interview</h3>
                    <p className="text-gray-600">Meet with potential team members and managers to ensure a good cultural fit.</p>
                  </div>
                  
                  <div className="relative pl-8 pb-8 border-l-2 border-blue-200">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                    <h3 className="font-semibold text-lg mb-2">5. Background Check</h3>
                    <p className="text-gray-600">We conduct thorough background checks to ensure the safety of our customers and team.</p>
                  </div>
                  
                  <div className="relative pl-8">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                    <h3 className="font-semibold text-lg mb-2">6. Offer & Onboarding</h3>
                    <p className="text-gray-600">If selected, you'll receive an offer and begin our comprehensive onboarding process.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-blue-600 text-white p-8 rounded-xl shadow-lg text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Ready to Join Our Team?</h2>
            <p className="text-xl mb-6 max-w-2xl mx-auto">
              We're always looking for talented individuals who are passionate about providing exceptional service.
            </p>
            <Link 
              to="/careers/apply" 
              className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-md"
            >
              Apply Now
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CareersPage;