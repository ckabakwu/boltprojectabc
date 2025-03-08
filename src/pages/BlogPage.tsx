import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    title: '10 Quick Cleaning Hacks for a Spotless Home in Half the Time',
    excerpt: 'Discover time-saving cleaning techniques that will transform your cleaning routine and give you more free time.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    date: '2025-05-15',
    author: 'Sarah Johnson',
    category: 'Cleaning Tips',
    tags: ['Time-Saving', 'Cleaning Hacks', 'Home Care']
  },
  {
    id: 2,
    title: 'The Ultimate Guide to Deep Cleaning Your Kitchen',
    excerpt: 'Learn how to properly deep clean every part of your kitchen, from appliances to cabinets and countertops.',
    image: 'https://images.unsplash.com/photo-1556911220-bda9f7f7597e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    date: '2025-05-08',
    author: 'Michael Chen',
    category: 'Deep Cleaning',
    tags: ['Kitchen', 'Deep Cleaning', 'Appliances']
  },
  {
    id: 3,
    title: 'How to Prepare Your Home for Professional Cleaners',
    excerpt: 'Make the most of your professional cleaning service with these simple preparation tips.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    date: '2025-04-29',
    author: 'Jessica Williams',
    category: 'Professional Cleaning',
    tags: ['Preparation', 'Professional Service', 'Efficiency']
  },
  {
    id: 4,
    title: 'Eco-Friendly Cleaning: Natural Products That Actually Work',
    excerpt: 'Discover effective, environmentally-friendly cleaning alternatives that are safe for your family and pets.',
    image: 'https://images.unsplash.com/photo-1556911261-6bd341186b2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    date: '2025-04-22',
    author: 'David Rodriguez',
    category: 'Green Cleaning',
    tags: ['Eco-Friendly', 'Natural Products', 'Sustainability']
  },
  {
    id: 5,
    title: 'The Complete Airbnb Cleaning Checklist for Hosts',
    excerpt: 'Ensure five-star reviews with this comprehensive cleaning checklist designed specifically for short-term rentals.',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    date: '2025-04-15',
    author: 'Emily Parker',
    category: 'Airbnb Hosting',
    tags: ['Airbnb', 'Rental Properties', 'Checklists']
  }
];

// Blog categories
const categories = [
  'All',
  'Cleaning Tips',
  'Deep Cleaning',
  'Professional Cleaning',
  'Green Cleaning',
  'Airbnb Hosting'
];

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Blog | HomeMaidy';
  }, []);

  useEffect(() => {
    // Filter posts based on category and search term
    let filtered = blogPosts;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredPosts(filtered);
  }, [selectedCategory, searchTerm]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
            <h1 className="text-4xl font-bold mb-4">Cleaning Tips & Insights</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert advice, cleaning hacks, and industry insights to help you maintain a cleaner, healthier home.
            </p>
          </motion.div>
          
          {/* Search and Categories */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl mx-auto mb-8"
            >
              <div className="relative">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          </div>
          
          {/* Blog Posts */}
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(post.date)}</span>
                      <span className="mx-2">•</span>
                      <User className="w-4 h-4 mr-1" />
                      <span>{post.author}</span>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-3 hover:text-blue-600 transition-colors">
                      <Link to={`/blog/${post.id}`}>
                        {post.title}
                      </Link>
                    </h2>
                    
                    <p className="text-gray-600 mb-4">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, i) => (
                        <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <Link 
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                    >
                      Read More
                      <ArrowRight className="ml-2" size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-gray-600">
                We couldn't find any articles matching your search. Please try different keywords or categories.
              </p>
            </div>
          )}
          
          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 bg-blue-600 text-white p-8 rounded-xl shadow-lg text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-xl mb-6 max-w-2xl mx-auto">
              Get the latest cleaning tips, guides, and exclusive offers delivered straight to your inbox.
            </p>
            <div className="max-w-md mx-auto">
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-md whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-sm mt-4 text-blue-100">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BlogPage;