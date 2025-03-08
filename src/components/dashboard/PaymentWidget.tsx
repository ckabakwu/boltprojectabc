import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, DollarSign, Calendar, Download, ChevronDown } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  type: 'payment' | 'payout';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

interface PaymentWidgetProps {
  transactions: Transaction[];
  balance: number;
  nextPayout: {
    date: string;
    amount: number;
  };
}

const PaymentWidget: React.FC<PaymentWidgetProps> = ({
  transactions,
  balance,
  nextPayout
}) => {
  const [showAll, setShowAll] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Payments & Earnings</h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-green-100 rounded-full p-2">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500">Available Balance</h3>
            <p className="text-2xl font-bold">${balance.toLocaleString()}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-blue-100 rounded-full p-2">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500">Next Payout</h3>
            <p className="text-2xl font-bold">${nextPayout.amount.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">{nextPayout.date}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-purple-100 rounded-full p-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
            <p className="text-lg font-medium">Direct Deposit</p>
            <p className="text-sm text-gray-500">••••6789</p>
          </div>
        </div>

        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.slice(0, showAll ? undefined : 5).map((transaction) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${transaction.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Download className="h-5 w-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {transactions.length > 5 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              {showAll ? 'Show Less' : 'View All'}
              <ChevronDown className={`ml-1 h-4 w-4 transform ${showAll ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentWidget;