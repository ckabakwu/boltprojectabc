import React from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin, User } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

interface Booking {
  id: number;
  date: string;
  time: string;
  service: string;
  address: string;
  status: string;
  cleaner?: {
    name: string;
    rating: number;
    image: string;
  };
}

interface BookingCalendarProps {
  bookings: Booking[];
  onDateSelect?: (date: Date) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ bookings, onDateSelect }) => {
  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return (
        bookingDate.getDate() === date.getDate() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayBookings = getBookingsForDate(date);
      if (dayBookings.length > 0) {
        return (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            <div className="h-1.5 w-1.5 bg-blue-600 rounded-full"></div>
          </div>
        );
      }
    }
    return null;
  };

  const handleDateChange = (value: Date) => {
    if (onDateSelect) {
      onDateSelect(value);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <Calendar
          onChange={handleDateChange}
          tileContent={tileContent}
          className="w-full border-0"
          tileClassName="relative"
        />
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-medium">
                  {format(new Date(booking.date), 'MMMM d, yyyy')}
                </span>
                <span className="mx-2 text-gray-300">|</span>
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <span>{booking.time}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                booking.status === 'confirmed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {booking.status}
              </span>
            </div>

            <div className="mb-3">
              <h4 className="font-medium">{booking.service}</h4>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {booking.address}
              </div>
            </div>

            {booking.cleaner && (
              <div className="flex items-center">
                <img
                  src={booking.cleaner.image}
                  alt={booking.cleaner.name}
                  className="h-8 w-8 rounded-full mr-2"
                />
                <div>
                  <p className="text-sm font-medium">{booking.cleaner.name}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    Rating: {booking.cleaner.rating}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BookingCalendar;