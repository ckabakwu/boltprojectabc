import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { locationService } from '../lib/locationService';

interface LocationAwareTextProps {
  defaultText: string;
  className?: string;
}

const LocationAwareText: React.FC<LocationAwareTextProps> = ({ defaultText, className = '' }) => {
  const [location, setLocation] = useState<{city: string; state: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectLocation = async () => {
      // First check cached location
      const cached = locationService.getCachedLocation();
      if (cached) {
        setLocation({ city: cached.city, state: cached.state });
        setIsLoading(false);
        return;
      }

      // Try to detect location
      const detected = await locationService.detectLocation();
      if (detected) {
        setLocation({ city: detected.city, state: detected.state });
      }
      setIsLoading(false);
    };

    detectLocation();
  }, []);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={className}
      >
        {defaultText}
      </motion.div>
    );
  }

  if (!location) {
    return <span className={className}>{defaultText}</span>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center ${className}`}
    >
      <MapPin className="w-5 h-5 mr-1" />
      <span>in {location.city}, {location.state}</span>
    </motion.div>
  );
}

export default LocationAwareText;