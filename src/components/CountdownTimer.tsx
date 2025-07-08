import React, { useState, useEffect } from 'react';
import { Clock, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimeCalculations } from '../utils/timeCalculations';
import { Card, CardContent } from './ui/card';

interface CountdownTimerProps {
  tahajjudStart: string;
  tahajjudEnd: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ tahajjudStart, tahajjudEnd }) => {
  const [countdown, setCountdown] = useState(() => {
    const isTahajjudTime = TimeCalculations.isCurrentlyTahajjudTime(tahajjudStart, tahajjudEnd);
    return isTahajjudTime 
      ? TimeCalculations.getCountdownToTime(tahajjudEnd)
      : TimeCalculations.getCountdownToTime(tahajjudStart);
  });

  const [isTahajjudTime, setIsTahajjudTime] = useState(() => 
    TimeCalculations.isCurrentlyTahajjudTime(tahajjudStart, tahajjudEnd)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const currentlyTahajjudTime = TimeCalculations.isCurrentlyTahajjudTime(tahajjudStart, tahajjudEnd);
      setIsTahajjudTime(currentlyTahajjudTime);
      
      const targetTime = currentlyTahajjudTime ? tahajjudEnd : tahajjudStart;
      setCountdown(TimeCalculations.getCountdownToTime(targetTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [tahajjudStart, tahajjudEnd]);

  const formatTimeUnit = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  const getProgressPercentage = (): number => {
    const totalSeconds = countdown.hours * 3600 + countdown.minutes * 60 + countdown.seconds;
    const maxSeconds = 12 * 3600; // 12 hours max for display
    return Math.max(0, Math.min(100, (totalSeconds / maxSeconds) * 100));
  };

  return (
    <motion.div 
      className="text-center mb-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="flex items-center justify-center gap-2 mb-4"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Moon className="h-6 w-6 text-amber-400" />
        </motion.div>
        <h2 className="text-xl font-semibold text-white">
          <AnimatePresence mode="wait">
            <motion.span
              key={isTahajjudTime ? 'ends' : 'starts'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {isTahajjudTime ? 'Tahajjud ends in' : 'Tahajjud starts in'}
            </motion.span>
          </AnimatePresence>
        </h2>
      </motion.div>

      <motion.div 
        className="relative w-48 h-48 mx-auto mb-6"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="2"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${getProgressPercentage() * 2.827} 282.7`}
            className="transition-all duration-1000 ease-out drop-shadow-lg"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div 
              className="text-3xl font-bold text-white mb-1"
              key={`${countdown.hours}:${countdown.minutes}:${countdown.seconds}`}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                animate={{ color: countdown.seconds % 2 === 0 ? '#ffffff' : '#fbbf24' }}
                transition={{ duration: 0.5 }}
              >
                {formatTimeUnit(countdown.hours)}:{formatTimeUnit(countdown.minutes)}:{formatTimeUnit(countdown.seconds)}
              </motion.span>
            </motion.div>
            <div className="text-sm text-white/60">
              {countdown.hours > 0 && `${countdown.hours}h `}
              {countdown.minutes > 0 && `${countdown.minutes}m `}
              {countdown.seconds}s
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isTahajjudTime && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-amber-400/20 to-orange-400/20 border-amber-400/30 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-center gap-2 text-amber-200">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Clock className="h-4 w-4" />
                  </motion.div>
                  <span className="text-sm font-medium">It's time for Tahajjud prayer</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};