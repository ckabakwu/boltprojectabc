import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin, DollarSign, User } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

interface Job {
  id: number;
  date: string;
  time: string;
  service: string;
  address: string;
  status: string;
  payment: number;
  client: {
    name: string;
    rating: number;
  };
  estimatedDuration?: string;
}

interface ProCalendarProps {
  jobs: Job[];
  onDateSelect?: (date: Date) => void;
}

const ProCalendar: React.FC<ProCalendarProps> = ({ jobs, onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getJobsForDate = (date: Date) => {
    return jobs.filter(job => {
      const jobDate = new Date(job.date);
      return (
        jobDate.getDate() === date.getDate() &&
        jobDate.getMonth() === date.getMonth() &&
        jobDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayJobs = getJobsForDate(date);
      if (dayJobs.length > 0) {
        return (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            <div className={`h-1.5 w-1.5 rounded-full ${
              dayJobs.some(job => job.status === 'confirmed') 
                ? 'bg-green-600' 
                : 'bg-blue-600'
            }`}></div>
          </div>
        );
      }
    }
    return null;
  };

  const handleDateChange = (value: Date) => {
    setSelectedDate(value);
    if (onDateSelect) {
      onDateSelect(value);
    }
  };

  const selectedDateJobs = selectedDate ? getJobsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileContent={tileContent}
          className="w-full border-0"
          tileClassName="relative"
        />
      </div>

      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-medium mb-4">
            Jobs for {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          
          {selectedDateJobs.length > 0 ? (
            <div className="space-y-4">
              {selectedDateJobs.map((job) => (
                <div
                  key={job.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-blue-600 mr-2" />
                      <span>{job.time}</span>
                      {job.estimatedDuration && (
                        <span className="text-gray-500 text-sm ml-2">
                          ({job.estimatedDuration})
                        </span>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>

                  <div className="mb-3">
                    <h4 className="font-medium">{job.service}</h4>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.address}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium">{job.client.name}</p>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500">
                            Rating: {job.client.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-green-600 font-medium">
                      <DollarSign className="h-5 w-5 mr-1" />
                      {job.payment}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No jobs scheduled for this date
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ProCalendar;