import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    location: 'New York, NY',
    rating: 5,
    text: 'I\'ve been using HomeMaidy for over a year now and I couldn\'t be happier. The cleaners are always professional, thorough, and friendly. My home has never looked better!'
  },
  {
    name: 'Michael Chen',
    location: 'San Francisco, CA',
    rating: 5,
    text: 'Booking was incredibly easy and the cleaner arrived right on time. They did an amazing job with my apartment and even paid special attention to the areas I mentioned. Will definitely use again!'
  },
  {
    name: 'Jessica Williams',
    location: 'Chicago, IL',
    rating: 4,
    text: 'Great service at a reasonable price. The booking process was seamless and my cleaner was very professional. The only reason for 4 stars is that they arrived 15 minutes late, but they did call ahead to let me know.'
  },
  {
    name: 'David Rodriguez',
    location: 'Miami, FL',
    rating: 5,
    text: 'I needed a last-minute deep clean before hosting a party and HomeMaidy came through! Booked in the morning and had a cleaner at my house by the afternoon. Outstanding service and results!'
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="section bg-gray-50">
      <div className="container-narrow">
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
        
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="card text-center px-8 py-10"
            >
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
                {[...Array(5 - testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i + testimonials[currentIndex].rating} className="w-5 h-5 text-gray-300" />
                ))}
              </div>
              
              <p className="text-gray-700 text-lg italic mb-6">
                "{testimonials[currentIndex].text}"
              </p>
              
              <div>
                <p className="font-semibold text-lg">{testimonials[currentIndex].name}</p>
                <p className="text-gray-500">{testimonials[currentIndex].location}</p>
              </div>
            </motion.div>
            
            <button 
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <button 
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;