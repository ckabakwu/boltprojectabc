import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  Filter,
  Star,
  ChevronDown,
  MessageSquare,
  Flag,
  CheckCircle,
  XCircle,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  User,
  Calendar,
  Edit,
  Trash2
} from 'lucide-react';

// Mock data for reviews
const reviews = [
  {
    id: 1,
    rating: 4,
    comment: "Great service! Maria was very thorough and professional. Would definitely book again.",
    date: "2025-06-15",
    status: "published",
    customer: {
      name: "John Smith",
      totalBookings: 5
    },
    pro: {
      name: "Maria Rodriguez",
      rating: 4.9,
      totalReviews: 85
    },
    booking: {
      id: "B1001",
      service: "Standard Cleaning",
      date: "2025-06-15"
    },
    helpful: 3,
    unhelpful: 0,
    reported: false,
    response: null
  },
  {
    id: 2,
    rating: 2,
    comment: "Cleaner arrived late and missed some areas. Not satisfied with the service.",
    date: "2025-06-14",
    status: "flagged",
    customer: {
      name: "Sarah Johnson",
      totalBookings: 3
    },
    pro: {
      name: "David Wilson",
      rating: 4.7,
      totalReviews: 42
    },
    booking: {
      id: "B1002",
      service: "Deep Cleaning",
      date: "2025-06-14"
    },
    helpful: 1,
    unhelpful: 2,
    reported: true,
    reportReason: "Unfair criticism",
    response: {
      text: "We apologize for the late arrival. We've discussed this with the cleaner and taken steps to ensure better timing. We'd love a chance to make it right with a complimentary service.",
      date: "2025-06-14"
    }
  },
  {
    id: 3,
    rating: 5,
    comment: "Excellent job! The house looks amazing. Very detailed work.",
    date: "2025-06-13",
    status: "published",
    customer: {
      name: "Michael Chen",
      totalBookings: 8
    },
    pro: {
      name: "Lisa Brown",
      rating: 4.8,
      totalReviews: 63
    },
    booking: {
      id: "B1003",
      service: "Move-Out Cleaning",
      date: "2025-06-13"
    },
    helpful: 5,
    unhelpful: 0,
    reported: false,
    response: {
      text: "Thank you for your kind words! It was a pleasure helping you with your move-out cleaning.",
      date: "2025-06-13"
    }
  }
];

const AdminReviewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showResponse, setShowResponse] = useState<number | null>(null);
  const [responseText, setResponseText] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'flagged':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmitResponse = (reviewId: number) => {
    // In a real app, this would submit the response to the backend
    console.log('Submitting response for review', reviewId, responseText);
    setShowResponse(null);
    setResponseText('');
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.pro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = selectedRating === 'all' || review.rating === parseInt(selectedRating);
    const matchesStatus = selectedStatus === 'all' || review.status === selectedStatus;
    
    return matchesSearch && matchesRating && matchesStatus;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor and manage customer reviews and feedback.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="bg-yellow-100 rounded-full p-3">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-sm">Last 30 days</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Average Rating</h3>
          <p className="text-2xl font-bold">4.8</p>
          <p className="text-sm text-gray-500 mt-2">from 256 reviews</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-green-500 text-sm">+12%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Positive Reviews</h3>
          <p className="text-2xl font-bold">92%</p>
          <p className="text-sm text-gray-500 mt-2">4-5 star ratings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="bg-red-100 rounded-full p-3">
              <Flag className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-red-500 text-sm">8 open</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Flagged Reviews</h3>
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm text-gray-500 mt-2">Require attention</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-100 rounded-full p-3">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-blue-500 text-sm">85%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Response Rate</h3>
          <p className="text-2xl font-bold">24h</p>
          <p className="text-sm text-gray-500 mt-2">Average response time</p>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search reviews by customer, pro, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter className="h-5 w-5 mr-2 text-gray-400" />
                Filters
                <ChevronDown className="ml-2 h-5 w-5 text-gray-400" />
              </button>
              
              {filterOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    <div className="px-4 py-2">
                      <label className="block text-sm font-medium text-gray-700">Rating</label>
                      <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={selectedRating}
                        onChange={(e) => setSelectedRating(e.target.value)}
                      >
                        <option value="all">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>
                    </div>
                    
                    <div className="px-4 py-2">
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="published">Published</option>
                        <option value="pending">Pending</option>
                        <option value="flagged">Flagged</option>
                      </select>
                    </div>
                    
                    <div className="px-4 py-2 flex justify-end">
                      <button
                        type="button"
                        className="text-sm text-gray-700 hover:text-gray-900"
                        onClick={() => {
                          setSelectedRating('all');
                          setSelectedStatus('all');
                        }}
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredReviews.map((review) => (
            <div key={review.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium text-gray-900">{review.customer.name}</p>
                      <span className="mx-2 text-gray-500">→</span>
                      <p className="font-medium text-gray-900">{review.pro.name}</p>
                    </div>
                    
                    <div className="mt-1 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="mt-2 text-gray-700">{review.comment}</p>
                    
                    {review.response && (
                      <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Response:</span> {review.response.text}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Responded on {new Date(review.response.date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-3 flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span>{review.helpful}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        <span>{review.unhelpful}</span>
                      </div>
                      {review.reported && (
                        <div className="flex items-center text-sm text-red-500">
                          <Flag className="h-4 w-4 mr-1" />
                          <span>Reported</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(review.status)}`}>
                    {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                  </span>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setShowResponse(showResponse === review.id ? null : review.id)}
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {showResponse === review.id && (
                <div className="mt-4">
                  <textarea
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    rows={3}
                    placeholder="Write a response..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                  ></textarea>
                  <div className="mt-3 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => setShowResponse(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => handleSubmitResponse(review.id)}
                    >
                      Post Response
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                  <span className="font-medium">97</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    Previous
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    3
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReviewsPage;