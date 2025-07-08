import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface PrayerTimeCardProps {
  title: string;
  time: string;
  icon: LucideIcon;
  iconColor: string;
  isHighlighted?: boolean;
}

export const PrayerTimeCard: React.FC<PrayerTimeCardProps> = ({ 
  title, 
  time, 
  icon: Icon, 
  iconColor, 
  isHighlighted = false 
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className={`
            relative bg-white/10 backdrop-blur-sm border-white/20 shadow-lg
            ${isHighlighted ? 'ring-2 ring-amber-400/50 bg-amber-400/5' : ''}
            hover:bg-white/15 transition-all duration-300 group cursor-pointer
          `}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </motion.div>
                <h3 className="text-white/80 text-sm font-medium">{title}</h3>
              </div>
              <div className="text-2xl font-bold text-white group-hover:text-amber-100 transition-colors">
                {time}
              </div>
              {isHighlighted && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-orange-400/10 rounded-xl pointer-events-none"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent className="bg-slate-800 border-white/20 text-white">
        <p>{isHighlighted ? 'Blessed time for night prayer' : `${title} prayer time`}</p>
      </TooltipContent>
    </Tooltip>
  );
};