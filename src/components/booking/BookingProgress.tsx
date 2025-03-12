import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export const BOOKING_STEPS = [
  {
    title: 'Service',
    description: 'Choose your service type'
  },
  {
    title: 'Details',
    description: 'Property information'
  },
  {
    title: 'Schedule',
    description: 'Pick date & time'
  },
  {
    title: 'Contact',
    description: 'Your information'
  },
  {
    title: 'Payment',
    description: 'Complete booking'
  }
];

interface BookingProgressProps {
  currentStep: number;
}

const BookingProgress: React.FC<BookingProgressProps> = ({ currentStep }) => {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center justify-between">
            {BOOKING_STEPS.map((step, index) => (
              <li key={step.title} className={`relative ${
                index !== BOOKING_STEPS.length - 1 ? 'pr-8 sm:pr-20' : ''
              }`}>
                {/* Connecting line */}
                {index !== BOOKING_STEPS.length - 1 && (
                  <div className="absolute top-4 left-7 -ml-px mt-0.5 w-full h-0.5 bg-gray-200">
                    <motion.div
                      className="h-full bg-blue-600"
                      initial={{ width: "0%" }}
                      animate={{ width: currentStep > index ? "100%" : "0%" }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}

                <div className="group relative flex items-center">
                  <motion.span
                    className="h-9 w-9 flex items-center justify-center rounded-full"
                    animate={{
                      backgroundColor: currentStep > index 
                        ? "#2563EB" 
                        : currentStep === index 
                        ? "#93C5FD" 
                        : "#E5E7EB",
                      color: currentStep > index 
                        ? "#FFFFFF" 
                        : currentStep === index 
                        ? "#1E40AF" 
                        : "#6B7280"
                    }}
                  >
                    {currentStep > index ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </motion.span>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    {step.title}
                    <span className="hidden sm:block text-xs text-gray-500">
                      {step.description}
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default BookingProgress;