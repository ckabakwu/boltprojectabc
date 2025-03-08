import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { Calendar, Clock, MapPin, DollarSign } from 'lucide-react';

interface Booking {
  id: string;
  date: Date;
  time: string;
  service: string;
  address: string;
  amount: number;
  client: {
    name: string;
  };
}

interface ScheduleCalendarProps {
  bookings: Booking[];
  onBookingClick: (booking: Booking) => void;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  bookings,
  onBookingClick
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));

  const weekDays = [...Array(7)].map((_, i) => addDays(currentWeek, i));

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => isSameDay(new Date(booking.date), date));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Schedule</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              Previous Week
            </button>
            <button
              onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              Next Week
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {weekDays.map((date, i) => (
          <div key={i} className="bg-white">
            <div className="py-2 px-3 text-center border-b border-gray-200">
              <div className="text-sm text-gray-900">
                {format(date, 'EEE')}
              </div>
              <div className="mt-1 text-lg font-semibold text-gray-900">
                {format(date, 'd')}
              </div>
            </div>
            <div className="h-48 overflow-y-auto p-2">
              {getBookingsForDate(date).map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-2 p-2 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100"
                  onClick={() => onBookingClick(booking)}
                >
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 text-blue-600 mr-1" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="font-medium text-sm mt-1">
                    {booking.service}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {booking.address}
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <span className="text-gray-600">{booking.client.name}</span>
                    <span className="text-green-600 font-medium flex items-center">
                      <DollarSign className="w-3 h-3 mr-0.5" />
                      {booking.amount}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleCalendar;