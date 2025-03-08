import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// FAQ categories and questions
const faqData = {
  'Booking & Scheduling': [
    {
      question: 'How do I book a cleaning?',
      answer: 'Booking is simple! Enter your zip code, select the type of cleaning you need, choose a date and time that works for you, and complete the booking with your payment information. You\'ll receive a confirmation email with all the details.'
    },
    {
      question: 'What if I need to cancel or reschedule?',
      answer: 'You can cancel or reschedule your booking through your account dashboard or by contacting our customer support. Cancellations made at least 24 hours before the scheduled cleaning are eligible for a full refund. For rescheduling, we\'ll do our best to accommodate your new preferred time.'
    },
    {
      question: 'Do you offer same-day bookings?',
      answer: 'Yes, we offer same-day bookings based on availability. However, we recommend booking at least 24 hours in advance to ensure you get your preferred time slot.'
    },
    {
      question: 'Can I book recurring cleanings?',
      answer: 'Absolutely! We offer weekly, bi-weekly, and monthly recurring cleaning services. You\'ll receive a discount on recurring bookings, and you can modify or cancel your schedule at any time.'
    }
  ],
  'Services & Pricing': [
    {
      question: 'How much does a cleaning cost?',
      answer: 'The cost depends on the size of your home, type of cleaning, and your location. You can get an instant quote by entering your zip code and selecting the service you need on our booking page.'
    },
    {
      question: 'What\'s included in a standard cleaning?',
      answer: 'Our standard cleaning includes dusting all accessible surfaces, vacuuming carpets and floors, mopping hard floors, cleaning kitchen counters and appliance exteriors, cleaning bathroom fixtures and surfaces, emptying trash bins, and making beds with provided linens.'
    },
    {
      question: 'What\'s the difference between standard and deep cleaning?',
      answer: 'A deep cleaning is more thorough than a standard cleaning and includes everything in a standard cleaning plus cleaning inside appliances, detailed bathroom scrubbing, baseboards, window sills, detailed dusting of blinds and vents, and more attention to build-up and hard-to-reach areas.'
    },
    {
      question: 'Do you offer any discounts?',
      answer: 'Yes, we offer discounts for recurring services: 15% off for weekly cleanings, 10% off for bi-weekly cleanings, and 5% off for monthly cleanings. We also occasionally offer seasonal promotions and referral discounts.'
    }
  ],
  'Cleaners & Quality': [
    {
      question: 'Are your cleaners background checked?',
      answer: 'Yes, all cleaners on our platform undergo a thorough background check and identity verification before they can accept any jobs. We take your safety and security very seriously.'
    },
    {
      question: 'What if I\'m not satisfied with the cleaning?',
      answer: 'We stand by our 100% satisfaction guarantee. If you\'re not satisfied with the cleaning, let us know within 24 hours and we\'ll send another cleaner to make it right at no additional cost to you.'
    },
    {
      question: 'Can I request the same cleaner for future bookings?',
      answer: 'Yes, if you\'re happy with a particular cleaner, you can request them for future bookings. While we can\'t guarantee availability, we do our best to accommodate these requests.'
    },
    {
      question: 'How are your cleaners vetted?',
      answer: 'Our cleaners go through a rigorous vetting process that includes a background check, reference verification, in-person interviews, and skills assessment. We only accept around 5% of applicants to ensure the highest quality service.'
    }
  ],
  'Preparation & Process': [
    {
      question: 'Do I need to provide cleaning supplies?',
      answer: 'Our cleaners bring their own professional-grade cleaning supplies and equipment. However, if you prefer that they use specific products you have, please let us know in the booking notes.'
    },
    {
      question: 'Do I need to be home during the cleaning?',
      answer: 'No, you don\'t need to be home during the cleaning. You can provide entry instructions during the booking process, such as a door code or where to find a key. If you prefer to be present, that\'s fine too!'
    },
    {
      question: 'How should I prepare for my cleaning appointment?',
      answer: 'To get the most out of your cleaning service, we recommend picking up clutter, securing valuables, and making sure the cleaner has access to all areas that need cleaning. This allows our cleaners to focus on deep cleaning rather than organizing.'
    },
    {
      question: 'Are pets a problem during cleaning?',
      answer: 'Our cleaners are generally comfortable working around pets. However, if your pet might be anxious around strangers or interfere with cleaning, we recommend securing them in a separate area during the service.'
    }
  ],
  'Payment & Security': [
    {
      question: 'How do I pay for services?',
      answer: 'Payment is processed securely online at the time of booking. We accept all major credit cards and digital payment methods like Apple Pay and Google Pay.'
    },
    {
      question: 'Is tipping expected?',
      answer: 'Tipping is not required but always appreciated by our cleaning professionals. If you\'d like to tip, you can do so in cash or through the app after your service is completed.'
    },
    {
      question: 'Is my personal information secure?',
      answer: 'Yes, we take data security very seriously. All personal and payment information is encrypted and stored securely. We never share your information with third parties without your consent.'
    },
    {
      question: 'Are your services insured?',
      answer: 'Yes, all cleanings booked through HomeMaidy are fully insured. In the rare event of damage during a cleaning, our insurance will cover the repair or replacement.'
    }
  ]
};

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('Booking & Scheduling');
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFAQs, setFilteredFAQs] = useState(faqData);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'FAQ | HomeMaidy';
  }, []);

  useEffect(() => {
    if (searchTerm) {
      // Filter FAQs based on search term
      const filtered: Record<string, any[]> = {};
      
      Object.entries(faqData).forEach(([category, questions]) => {
        const matchingQuestions = questions.filter(
          q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
               q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (matchingQuestions.length > 0) {
          filtered[category] = matchingQuestions;
        }
      });
      
      setFilteredFAQs(filtered);
      
      // If the active category has no results, set to the first category with results
      const categories = Object.keys(filtered);
      if (categories.length > 0 && !filtered[activeCategory]) {
        setActiveCategory(categories[0]);
      }
    } else {
      setFilteredFAQs(faqData);
    }
  }, [searchTerm, activeCategory]);

  const toggleQuestion = (questionIndex: string) => {
    setOpenQuestions(prev => ({
      ...prev,
      [questionIndex]: !prev[questionIndex]
    }));
  };

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
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our cleaning services, booking process, and more.
            </p>
          </motion.div>
          
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for questions..."
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="md:w-1/4"
            >
              <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
                <h2 className="font-bold text-lg mb-4 text-gray-800">Categories</h2>
                <nav className="space-y-1">
                  {Object.keys(filteredFAQs).map((category) => (
                    <button
                      key={category}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        activeCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                      <span className="ml-2 text-sm">
                        ({filteredFAQs[category].length})
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>
            
            {/* Questions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="md:w-3/4"
            >
              {Object.keys(filteredFAQs).length > 0 ? (
                <div>
                  {filteredFAQs[activeCategory] && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6">{activeCategory}</h2>
                      <div className="space-y-4">
                        {filteredFAQs[activeCategory].map((faq, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-xl shadow-sm overflow-hidden"
                          >
                            <button
                              onClick={() => toggleQuestion(`${activeCategory}-${index}`)}
                              className="w-full text-left p-5 flex justify-between items-center transition-colors hover:bg-gray-50"
                            >
                              <span className="font-semibold text-lg">{faq.question}</span>
                              {openQuestions[`${activeCategory}-${index}`] ? (
                                <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-blue-600 flex-shrink-0" />
                              )}
                            </button>
                            
                            {openQuestions[`${activeCategory}-${index}`] && (
                              <div className="p-5 border-t border-gray-100 bg-gray-50">
                                <p className="text-gray-700">{faq.answer}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">No results found</h3>
                  <p className="text-gray-600">
                    We couldn't find any FAQs matching your search. Please try different keywords.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
          
          {/* Still Have Questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 bg-blue-600 text-white p-8 rounded-xl shadow-lg text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-xl mb-6 max-w-2xl mx-auto">
              Our customer support team is ready to help you with any other questions you might have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+18001234567" 
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-md"
              >
                Call Us: (800) 123-4567
              </a>
              <a 
                href="/contact" 
                className="bg-blue-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors shadow-md"
              >
                Contact Support
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default FAQPage;