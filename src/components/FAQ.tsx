import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'How do I book a cleaning?',
    answer: 'Booking is simple! Enter your zip code, select the type of cleaning you need, choose a date and time that works for you, and complete the booking with your payment information. You\'ll receive a confirmation email with all the details.'
  },
  {
    question: 'Are your cleaners background checked?',
    answer: 'Yes, all cleaners on our platform undergo a thorough background check and identity verification before they can accept any jobs. We take your safety and security very seriously.'
  },
  {
    question: 'What if I need to cancel or reschedule?',
    answer: 'You can cancel or reschedule your booking through your account dashboard or by contacting our customer support. Cancellations made at least 24 hours before the scheduled cleaning are eligible for a full refund. For rescheduling, we\'ll do our best to accommodate your new preferred time.'
  },
  {
    question: 'Do I need to provide cleaning supplies?',
    answer: 'Our cleaners bring their own professional-grade cleaning supplies and equipment. However, if you prefer that they use specific products you have, please let us know in the booking notes.'
  },
  {
    question: 'How much does a cleaning cost?',
    answer: 'The cost depends on the size of your home, type of cleaning, and your location. You can get an instant quote by entering your zip code and selecting the service you need on our booking page.'
  },
  {
    question: 'Is there a satisfaction guarantee?',
    answer: 'Absolutely! If you\'re not satisfied with the cleaning, let us know within 24 hours and we\'ll send another cleaner to make it right at no additional cost to you.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section bg-gray-50" id="faq">
      <div className="container-narrow">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our cleaning services.
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="mb-4"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full text-left p-5 rounded-lg flex justify-between items-center transition-colors ${
                  openIndex === index ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'
                }`}
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-5 rounded-b-lg shadow-md"
                >
                  <p className="text-gray-700">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;