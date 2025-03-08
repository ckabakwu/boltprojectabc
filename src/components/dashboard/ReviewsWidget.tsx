import React from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';

interface Review {
  id: number;
  customerName: string;
  customerImage: string;
  rating: number;
  comment: string;
  date: string;
  jobType: string;
  helpful: number;
  response?: {
    text: string;
    date: string;
  };
}

interface ReviewsWidgetProps {
  reviews: Review[];
}

const ReviewsWidget: React.FC<ReviewsWidgetProps> = ({ reviews }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Recent Reviews</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <div className="flex items-start">
              <img
                src={review.customerImage}
                alt={review.customerName}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    {review.customerName}
                  </h3>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>

                <div className="flex items-center mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">
                    {review.jobType}
                  </span>
                </div>

                <p className="mt-2 text-sm text-gray-700">{review.comment}</p>

                {review.response && (
                  <div className="mt-3 bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{review.response.text}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Responded on {review.response.date}
                    </p>
                  </div>
                )}

                <div className="mt-3 flex items-center space-x-4">
                  <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
          View all reviews
        </button>
      </div>
    </div>
  );
};

export default ReviewsWidget;