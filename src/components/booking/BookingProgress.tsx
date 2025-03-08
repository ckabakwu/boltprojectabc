import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface BookingProgressProps {
  currentStep: number;
  steps: {
    title: string;
    description: string;
  }[];
}

const BookingProgress: React.FC<BookingProgressProps> = ({ currentStep, steps }) => {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center">
            {steps.map((step, index) => (
              <li key={step.title} className={`relative ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                {/* Connecting line */}
                {index !== steps.length - 1 && (
                  <div className="absolute top-4 left-7 -ml-px mt-0.5 w-full h-0.5 bg-gray-200">
                    <motion.div
                      className="h-full bg-blue-600"
                      initial={{ width: "0%" }}
                      animate={{ width: currentStep > index ? "100%" : "0%" }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}

                <div className="relative flex items-center">
                  <motion.span
                    className="h-9 w-9 flex items-center justify-center"
                    animate={{
                      backgroundColor: currentStep > index ? "#2563EB" : currentStep === index ? "#93C5FD" : "#E5E7EB",
                      color: currentStep > index ? "#FFFFFF" : currentStep === index ? "#1E40AF" : "#6B7280"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {currentStep > index ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </motion.span>
                  <motion.span
                    className="ml-4 min-w-0 flex flex-col"
                    animate={{
                      color: currentStep >= index ? "#111827" : "#6B7280"
                    }}
                  >
                    <span className="text-sm font-medium">{step.title}</span>
                    <span className="text-sm">{step.description}</span>
                  </motion.span>
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