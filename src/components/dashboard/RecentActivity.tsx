import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, DollarSign, Star, MessageSquare } from 'lucide-react';

interface Activity {
  id: string;
  type: 'booking' | 'review' | 'message' | 'payment';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-5 w-5 text-blue-600" />;
      case 'review':
        return <Star className="h-5 w-5 text-yellow-600" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-green-600" />;
      case 'payment':
        return <DollarSign className="h-5 w-5 text-purple-600" />;
      default:
        return null;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-6 hover:bg-gray-50"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {activity.description}
                </p>
                {activity.metadata && activity.type === 'booking' && (
                  <div className="mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{activity.metadata.time}</span>
                      <span className="mx-2">•</span>
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{activity.metadata.address}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
          View all activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;