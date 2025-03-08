import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, DollarSign, X } from 'lucide-react';

interface RatingTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string, tipAmount: number) => Promise<void>;
  providerName: string;
  bookingDetails: {
    service: string;
    date: string;
    amount: number;
  };
}

const RatingTipModal: React.FC<RatingTipModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  providerName,
  bookingDetails
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [tipAmount, setTipAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const suggestedTips = [
    { percentage: 15, amount: Math.round(bookingDetails.amount * 0.15) },
    { percentage: 20, amount: Math.round(bookingDetails.amount * 0.20) },
    { percentage: 25, amount: Math.round(bookingDetails.amount * 0.25) }
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(rating, review, tipAmount);
      onClose();
    } catch (error) {
      console.error('Error submitting rating and tip:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Rate Your Experience</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              How was your cleaning with {providerName}?
            </h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="p-1 focus:outline-none"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review */}
          <div>
            <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
              Write a Review (Optional)
            </label>
            <textarea
              id="review"
              rows={4}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Share your experience..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>

          {/* Tip */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Would you like to add a tip?
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {suggestedTips.map((tip) => (
                <button
                  key={tip.percentage}
                  onClick={() => setTipAmount(tip.amount)}
                  className={`p-3 text-center border rounded-lg transition-colors ${
                    tipAmount === tip.amount
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{tip.percentage}%</div>
                  <div className="text-sm text-gray-500">${tip.amount}</div>
                </button>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                min="0"
                step="1"
                className="block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Custom amount"
                value={tipAmount || ''}
                onChange={(e) => setTipAmount(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!rating || isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Rating & Tip'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RatingTipModal;