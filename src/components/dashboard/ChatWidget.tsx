import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Paperclip, Image } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'pro' | 'system';
  timestamp: Date;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! How can I help you today?",
      sender: 'system',
      timestamp: new Date()
    }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: messages.length + 2,
        text: "Thanks for your message! A customer service representative will respond shortly.",
        sender: 'system',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 w-96 bg-white rounded-xl shadow-xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
              <h3 className="font-semibold">Customer Support</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : msg.sender === 'system'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-green-600 text-white'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {msg.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Paperclip className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Image className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  className="flex-1 mx-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                  onClick={handleSend}
                  className="p-2 text-blue-600 hover:text-blue-800"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;