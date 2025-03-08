import React from 'react';
import { motion } from 'framer-motion';
import { Star, Gift, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PointsWidgetProps {
  points: number;
  level: string;
  nextLevelPoints: number;
  rewards: {
    id: string;
    name: string;
    description: string;
    pointsRequired: number;
    discountAmount: number;
  }[];
}

const PointsWidget: React.FC<PointsWidgetProps> = ({
  points,
  level,
  nextLevelPoints,
  rewards
}) => {
  const progress = (points / nextLevelPoints) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Loyalty Points</h2>
          <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {level} Member
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-2xl font-bold">{points}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Points Available</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Next Level</p>
            <p className="font-medium">{nextLevelPoints - points} points away</p>
          </div>
        </div>

        <div className="relative pt-1">
          <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Available Rewards</h3>
        <div className="space-y-4">
          {rewards.map((reward) => (
            <div key={reward.id} className="flex items-center justify-between">
              <div className="flex items-start">
                <Gift className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                <div>
                  <p className="font-medium">{reward.name}</p>
                  <p className="text-sm text-gray-500">{reward.description}</p>
                </div>
              </div>
              <button
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  points >= reward.pointsRequired
                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={points < reward.pointsRequired}
              >
                {reward.pointsRequired} points
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link
            to="/customer-dashboard/rewards"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            View All Rewards
            <TrendingUp className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PointsWidget;