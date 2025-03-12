import React from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

interface Booking {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  service_type: string;
  address: string;
  status: string;
}

interface BookingCalendarProps {
  bookings: Booking[];
  onDateSelect?: (date: Date) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ bookings, onDateSelect }) => {
  const getBookingsForDate = (date: Date) => {
    return bookings.filter(
      (booking) => 
        format(new Date(booking.scheduled_date), 'yyyy-MM-dd') === 
        format(date, 'yyyy-MM-dd')
    );
  };

  const tileContent = ({ date }: { date: Date }) => {
    const dayBookings = getBookingsForDate(date);
    if (dayBookings.length === 0) return null;

    return (
      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
        {dayBookings.length > 1 && (
          <div className="h-1.5 w-1.5 rounded-full bg-blue-600 ml-0.5"></div>
        )}
      </div>
    );
  };

  const handleDateChange = (date: Date) => {
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <Calendar
          className="w-full"
          tileContent={tileContent}
          onChange={handleDateChange}
          tileClassName="relative"
          minDate={new Date()}
        />
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">
                {booking.service_type}
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {format(new Date(booking.scheduled_date), 'MMM dd, yyyy')}
                <Clock className="h-4 w-4 mx-1" />
                {booking.scheduled_time}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                {booking.address}
              </div>
            </div>
          </motion.div>
        ))}

        {bookings.length === 0 && (
          <div className="text-center py-6 bg-white rounded-lg shadow">
            <p className="text-gray-500">No bookings scheduled for this date</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCalendar;