import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
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

interface CityInputDialogProps {
  onCitySet: (cityName: string) => void;
  currentCity?: string;
}

export const CityInputDialog: React.FC<CityInputDialogProps> = ({
  onCitySet,
  currentCity = ''
}) => {
  const [cityName, setCityName] = useState(currentCity);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cityName.trim()) {
      setIsLoading(true);
      try {
        await onCitySet(cityName.trim());
        setOpen(false);
      } catch (error) {
        // Error handling is done in the parent component
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button variant="glass" size="sm" className="gap-2">
            <MapPin className="h-4 w-4" />
            Set Location
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-slate-900/95 backdrop-blur-sm border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-400">
            <MapPin className="h-5 w-5" />
            Set Your Location
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Enter your city name to get accurate prayer times
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-white/90">
                  City Name
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    id="city"
                    type="text"
                    placeholder="e.g., New York, London, Dubai"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white hover:bg-white/10"
              disabled={isLoading}
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
                disabled={isLoading || !cityName.trim()}
              >
                {isLoading ? 'Finding...' : 'Get Prayer Times'}
              </Button>
            </motion.div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};