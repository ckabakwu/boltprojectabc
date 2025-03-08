import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  MessageSquare, 
  Phone, 
  Video, 
  Image as ImageIcon,
  Paperclip,
  Send,
  MoreVertical,
  Star,
  Calendar
} from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  online: boolean;
  typing?: boolean;
}

interface MessageCenterProps {
  conversations: Conversation[];
  activeConversation?: number;
  onConversationSelect: (id: number) => void;
}

const MessageCenter: React.FC<MessageCenterProps> = ({
  conversations,
  activeConversation,
  onConversationSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // Handle sending message
    setNewMessage('');
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) {
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      return `${days}d`;
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-y-auto h-full">
          {filteredConversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                activeConversation === conversation.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => onConversationSelect(conversation.id)}
            >
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {formatTimestamp(conversation.timestamp)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-500 truncate">
                      {conversation.typing ? (
                        <span className="text-blue-600">Typing...</span>
                      ) : (
                        conversation.lastMessage
                      )}
                    </p>
                    {conversation.unread > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
              alt="Active chat"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="ml-3">
              <h3 className="text-sm font-medium">Sarah Johnson</h3>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <Phone className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <Video className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <Star className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Messages will be rendered here */}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
              >
                <Paperclip className="h-5 w-5" />
              </button>
              {showAttachMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200"
                >
                  <div className="p-2">
                    <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg w-full">
                      <ImageIcon className="h-4 w-4" />
                      <span>Image</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg w-full">
                      <Calendar className="h-4 w-4" />
                      <span>Schedule</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
              onClick={handleSendMessage}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;