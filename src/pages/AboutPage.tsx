import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle, 
  Shield, 
  Clock, 
  ThumbsUp,
  Users,
  Target,
  Heart,
  Award,
  CreditCard,
  Calendar,
  Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'About Us | HomeMaidy';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-6">Bringing Professional Cleaning Services to Your Doorstep</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Our mission is to provide trusted, high-quality, and hassle-free cleaning services at the tap of a button.
            </p>
            <Link 
              to="/booking" 
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
            >
              Book Now
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                We started HomeMaidy with one goal in mind—making professional cleaning services more accessible, reliable, and stress-free. We believe that a clean home leads to a better life, and we're here to ensure you get top-tier service every time.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Founded in 2022, HomeMaidy was born out of frustration with the traditional cleaning service model. Booking was complicated, pricing was unclear, and quality was inconsistent. We knew there had to be a better way.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our platform connects homeowners with skilled, background-checked cleaning professionals in their area. With transparent pricing, easy online booking, and a satisfaction guarantee, we've simplified the entire process from start to finish. Today, thousands of customers trust HomeMaidy for their cleaning needs, and we're just getting started.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Our Mission & Values */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              At HomeMaidy, we're guided by a set of core values that shape everything we do.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
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
              <h3 className="text-xl font-semibold mb-3">Trust & Reliability</h3>
              <p className="text-gray-600">
                Every cleaner is background-checked and highly trained. We prioritize your safety and security above all else, ensuring you can trust the professionals entering your home.
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
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Convenience</h3>
              <p className="text-gray-600">
                Book a cleaning in just a few clicks, anytime, anywhere. Our platform is designed to make managing your home cleaning needs as simple and hassle-free as possible.
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
                <ThumbsUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Customer Satisfaction</h3>
              <p className="text-gray-600">
                We stand by our 100% satisfaction guarantee. If you're not happy with the cleaning, we'll make it right. Your complete satisfaction is our ultimate goal.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              HomeMaidy offers a modern approach to home cleaning with features designed to make your life easier.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-start mb-4">
                <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Easy Online Booking & Secure Payments</h3>
                  <p className="text-gray-600">
                    Book and manage your cleanings online in minutes. Our secure payment system protects your financial information.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-start mb-4">
                <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Vetted, Background-Checked Professionals</h3>
                  <p className="text-gray-600">
                    Every cleaner undergoes a thorough background check and identity verification before joining our platform.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-start mb-4">
                <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Flexible Scheduling</h3>
                  <p className="text-gray-600">
                    Same-day & next-day availability to fit your busy lifestyle. Reschedule easily when your plans change.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-start mb-4">
                <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">100% Satisfaction Guarantee</h3>
                  <p className="text-gray-600">
                    Not happy with the cleaning? We'll send another pro to make it right at no extra cost to you.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Our Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Meet Our Leadership Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind HomeMaidy who are dedicated to transforming the cleaning industry.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" 
                alt="CEO" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-1">Michael Roberts</h3>
              <p className="text-blue-600 mb-3">CEO & Co-Founder</p>
              <p className="text-gray-600">
                Former operations executive with 15+ years of experience in the service industry.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" 
                alt="COO" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-1">Sarah Chen</h3>
              <p className="text-blue-600 mb-3">COO & Co-Founder</p>
              <p className="text-gray-600">
                Tech industry veteran with expertise in scaling marketplace platforms.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <img 
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" 
                alt="CTO" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-1">David Patel</h3>
              <p className="text-blue-600 mb-3">CTO</p>
              <p className="text-gray-600">
                Software engineer with a passion for creating intuitive, user-friendly platforms.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Join Our Team Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Work on Your Own Schedule. Earn More as a Professional Cleaner.</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join our network of trusted cleaning professionals. Set your own hours, earn competitive pay, and build your client base.
            </p>
            <Link 
              to="/pro-signup" 
              className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-md"
            >
              Join as a Pro
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Ready for a Spotless Home?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience the HomeMaidy difference today. Book your first cleaning and see why thousands of customers trust us with their homes.
            </p>
            <Link 
              to="/booking" 
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
            >
              Book Now
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AboutPage;