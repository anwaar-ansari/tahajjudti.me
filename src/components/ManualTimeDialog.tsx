import React, { useState } from 'react';
import { Settings, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';

interface ManualTimeDialogProps {
  onManualTimesSet: (maghrib: string, fajr: string) => void;
  currentMaghrib?: string;
  currentFajr?: string;
}

export const ManualTimeDialog: React.FC<ManualTimeDialogProps> = ({
  onManualTimesSet,
  currentMaghrib = '',
  currentFajr = ''
}) => {
  const [maghribTime, setMaghribTime] = useState(currentMaghrib);
  const [fajrTime, setFajrTime] = useState(currentFajr);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (maghribTime && fajrTime) {
      onManualTimesSet(maghribTime, fajrTime);
      setOpen(false);
    }
  };

  const formatTimeForInput = (time: string): string => {
    if (!time) return '';
    // Convert "7:30 PM" to "19:30" format for input
    const [timePart, period] = time.split(' ');
    const [hours, minutes] = timePart.split(':');
    let hour24 = parseInt(hours);
    
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    
    return `${hour24.toString().padStart(2, '0')}:${minutes}`;
  };

  const formatTimeForDisplay = (time: string): string => {
    if (!time) return '';
    // Convert "19:30" to "7:30 PM" format
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period = hour24 >= 12 ? 'PM' : 'AM';
    
    return `${hour12}:${minutes} ${period}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button variant="glass" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Manual Times
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-slate-900/95 backdrop-blur-sm border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-400">
            <Clock className="h-5 w-5" />
            Set Prayer Times Manually
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Enter Maghrib and Fajr times to calculate your Tahajjud window
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maghrib" className="text-white/90">
                  Maghrib Time
                </Label>
                <Input
                  id="maghrib"
                  type="time"
                  value={formatTimeForInput(maghribTime)}
                  onChange={(e) => setMaghribTime(formatTimeForDisplay(e.target.value))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fajr" className="text-white/90">
                  Fajr Time
                </Label>
                <Input
                  id="fajr"
                  type="time"
                  value={formatTimeForInput(fajrTime)}
                  onChange={(e) => setFajrTime(formatTimeForDisplay(e.target.value))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                type="submit" 
                variant="amber"
                className="bg-amber-500 hover:bg-amber-600"
              >
                Calculate Tahajjud
              </Button>
            </motion.div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};