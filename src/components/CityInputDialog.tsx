import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { LocationService } from '../services/locationService';

interface LocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  admin2?: string;
}

interface CityInputDialogProps {
  onCitySet: (cityName: string) => void;
  currentCity?: string;
}

export const CityInputDialog: React.FC<CityInputDialogProps> = ({
  onCitySet,
  currentCity = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const searchLocations = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await LocationService.searchLocations(searchQuery);
        setSearchResults(results);
        setShowDropdown(results.length > 0);
      } catch (error) {
        console.error('Error searching locations:', error);
        setSearchResults([]);
        setShowDropdown(false);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchLocations, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationSelect = (location: LocationResult) => {
    setSelectedLocation(location);
    setSearchQuery(getLocationDisplayName(location));
    setShowDropdown(false);
  };

  const getLocationDisplayName = (location: LocationResult): string => {
    const parts = [location.name];
    if (location.admin1) parts.push(location.admin1);
    if (location.country) parts.push(location.country);
    return parts.join(', ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedLocation) {
      setIsLoading(true);
      try {
        const location = await LocationService.getLocationById(selectedLocation);
        await onCitySet(location.city);
        setOpen(false);
        setSearchQuery('');
        setSelectedLocation(null);
      } catch (error) {
        // Error handling is done in the parent component
      } finally {
        setIsLoading(false);
      }
    } else if (searchQuery.trim()) {
      setIsLoading(true);
      try {
        await onCitySet(searchQuery.trim());
        setOpen(false);
        setSearchQuery('');
      } catch (error) {
        // Error handling is done in the parent component
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedLocation(null);
    if (value.length >= 2) {
      setShowDropdown(true);
    }
  };

  const handleInputFocus = () => {
    if (searchResults.length > 0 && searchQuery.length >= 2) {
      setShowDropdown(true);
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
            Search for your city to get accurate prayer times
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
                    ref={inputRef}
                    id="city"
                    type="text"
                    placeholder="Search for your city..."
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10 pr-10"
                    required
                    disabled={isLoading}
                    autoComplete="off"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full animate-spin"></div>
                    </div>
                  )}
                  {!isSearching && searchResults.length > 0 && (
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  )}
                </div>
                
                {/* Dropdown */}
                <AnimatePresence>
                  {showDropdown && searchResults.length > 0 && (
                    <motion.div
                      ref={dropdownRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-50 w-full mt-1 bg-slate-800/95 backdrop-blur-sm border border-white/20 rounded-md shadow-lg max-h-60 overflow-y-auto"
                    >
                      {searchResults.map((location, index) => (
                        <motion.button
                          key={location.id}
                          type="button"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleLocationSelect(location)}
                          className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0 focus:outline-none focus:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-amber-400 flex-shrink-0" />
                            <div>
                              <div className="text-white font-medium">
                                {location.name}
                              </div>
                              <div className="text-white/60 text-sm">
                                {[location.admin1, location.country].filter(Boolean).join(', ')}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => {
                setOpen(false);
                setSearchQuery('');
                setSelectedLocation(null);
                setShowDropdown(false);
              }}
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
                disabled={isLoading || !searchQuery.trim()}
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