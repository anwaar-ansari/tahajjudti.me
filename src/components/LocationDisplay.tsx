import React from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Location } from '../types';

interface LocationDisplayProps {
  location: Location | null;
  date: string;
  hijriDate: string;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({ location, date, hijriDate }) => {
  return (
    <motion.div 
      className="text-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.div 
        className="flex items-center justify-center gap-2 mb-4"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <MapPin className="h-5 w-5 text-amber-400" />
        </motion.div>
        <motion.span 
          className="text-white/80 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {location ? `${location.city}, ${location.country}` : 'Loading location...'}
        </motion.span>
      </motion.div>
      
      <motion.div 
        className="flex items-center justify-center gap-3 text-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Calendar className="h-4 w-4" />
        </motion.div>
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
          <motion.span 
            className="text-sm"
            whileHover={{ color: '#fbbf24' }}
            transition={{ duration: 0.2 }}
          >
            {date}
          </motion.span>
          <motion.span 
            className="text-sm text-amber-300"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {hijriDate}
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
};