import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Home, 
  User, 
  LogOut, 
  Settings, 
  MessageSquare,
  Send,
  Search,
  Sliders,
  DollarSign,
  CheckCircle,
  Clock,
  Paperclip,
  Smile,
  MoreVertical
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Mock data for conversations
const conversations = [
  {
    id: 1,
    client: {
      name: 'John Smith',
      image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'
    },
    lastMessage: {
      text: 'Do you need any special cleaning supplies?',
      time: '10:30 AM',
      isUnread: true
    },
    jobDetails: {
      id: 101,
      service: 'Standard Cleaning',
      date: '2025-06-15',
      time: '10:00 AM'
    }
  },
  {
    id: 2,
    client: {
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'
    },
    lastMessage: {
      text: 'Thanks for the great service!',
      time: 'Yesterday',
      isUnread: false
    },
    jobDetails: {
      id: 102,
      service: 'Deep Cleaning',
      date: '2025-06-10',
      time: '2:00 PM'
    }
  },
  {
    id: 3,
    client: {
      name: 'Michael Chen',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'
    },
    lastMessage: {
      text: 'The gate code is 1234',
      time: 'Jun 5',
      isUnread: false
    },
    jobDetails: {
      id: 103,
      service: 'Standard Cleaning',
      date: '2025-06-05',
      time: '9:00 AM'
    }
  }
];

// Mock data for messages in a conversation
const messages = [
  {
    id: 1,
    sender: 'client',
    text: 'Hi Maria, I wanted to check if you need any special cleaning supplies for tomorrow?',
    time: '10:30 AM'
  },
  {
    id: 2,
    sender: 'pro',
    text: "Hello John! No need to worry, I'll bring all the necessary cleaning supplies with me. Is there anything specific you'd like me to focus on during the cleaning?",
    time: '10:35 AM'
  },
  {
    id: 3,
    sender: 'client',
    text: "Great! Could you please pay extra attention to the kitchen and bathrooms? We're having guests over this weekend.",
    time: '10:40 AM'
  },
  {
    id: 4,
    sender: 'pro',
    text: "Absolutely! I'll make sure the kitchen and bathrooms are spotless. Is there a specific time you'd prefer me to arrive within the scheduled window?",
    time: '10:42 AM'
  },
  {
    id: 5,
    sender: 'client',
    text: 'If possible, closer to 10:00 AM would be great. Also, do you need any special instructions for entering the building?',
    time: '10:45 AM'
  }
];

const ProMessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    // In a real app, this would send the message to the backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };
  
  const filteredConversations = conversations.filter(conversation => 
    conversation.client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container-narrow">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Maria Rodriguez</h3>
                      <p className="text-sm text-gray-500">Professional Cleaner</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <nav className="space-y-1">
                    <Link to="/pro-dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                      <Home className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link to="/available-jobs" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                      <Calendar className="w-5 h-5" />
                      <span>Available Jobs</span>
                    </Link>
                    <Link to="/my-jobs" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                      <CheckCircle className="w-5 h-5" />
                      <span>My Jobs</span>
                    </Link>
                    <Link to="/earnings" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                      <DollarSign className="w-5 h-5" />
                      <span>Earnings</span>
                    </Link>
                    <Link to="/messages" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-700">
                      <MessageSquare className="w-5 h-5" />
                      <span>Messages</span>
                    </Link>
                    <Link to="/availability" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                      <Sliders className="w-5 h-5" />
                      <span>Availability</span>
                    </Link>
                    <Link to="/settings" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </Link>
                    <Link to="/logout" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-grow">
              <h1 className="text-2xl font-bold mb-6">Messages</h1>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="flex h-[600px]">
                  {/* Conversations List */}
                  <div className="w-1/3 border-r border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Search messages"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="overflow-y-auto h-[calc(600px-65px)]">
                      {filteredConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                            selectedConversation.id === conversation.id ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => setSelectedConversation(conversation)}
                        >
                          <div className="flex items-center">
                            <img
                              src={conversation.client.image}
                              alt={conversation.client.name}
                              className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-3 flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {conversation.client.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {conversation.lastMessage.time}
                                </p>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className={`text-sm truncate ${
                                  conversation.lastMessage.isUnread ? 'font-semibold text-gray-900' : 'text-gray-500'
                                }`}>
                                  {conversation.lastMessage.text}
                                </p>
                                {conversation.lastMessage.isUnread && (
                                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {conversation.jobDetails.service}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">
                              {new Date(conversation.jobDetails.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Conversation */}
                  <div className="w-2/3 flex flex-col">
                    {/* Conversation Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={selectedConversation.client.image}
                          alt={selectedConversation.client.name}
                          className="h-10 w-10 rounded-full"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {selectedConversation.client.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {selectedConversation.jobDetails.service} • {new Date(selectedConversation.jobDetails.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {selectedConversation.jobDetails.time}
                          </p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-500">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                    
                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === 'pro' ? 'justify-end' : 'justify-start'}`}
                          >
                            {message.sender === 'client' && (
                              <img
                                src={selectedConversation.client.image}
                                alt={selectedConversation.client.name}
                                className="h-8 w-8 rounded-full mr-2"
                              />
                            )}
                            <div
                              className={`max-w-xs px-4 py-2 rounded-lg ${
                                message.sender === 'pro'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                              <p className={`text-xs mt-1 text-right ${
                                message.sender === 'pro' ? 'text-blue-200' : 'text-gray-500'
                              }`}>
                                {message.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200">
                      <form onSubmit={handleSendMessage} className="flex items-center">
                        <button
                          type="button"
                          className="p-2 rounded-full text-gray-400 hover:text-gray-500"
                        >
                          <Paperclip className="h-5 w-5" />
                        </button>
                        <input
                          type="text"
                          className="flex-1 border-0 focus:ring-0 focus:outline-none px-4 py-2"
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button
                          type="button"
                          className="p-2 rounded-full text-gray-400 hover:text-gray-500"
                        >
                          <Smile className="h-5 w-5" />
                        </button>
                        <button
                          type="submit"
                          className="ml-2 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Send
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Message Guidelines */}
              <div className="mt-6 bg-blue-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Messaging Guidelines</h3>
                <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
                  <li>Only communicate about job-related matters</li>
                  <li>Never share personal contact information</li>
                  <li>Be professional and respectful at all times</li>
                  <li>Report any inappropriate messages to support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProMessagesPage;