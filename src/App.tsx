import React, { useState, useEffect } from 'react';
import { Sunrise, Sunset, Moon, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LocationService } from './services/locationService';
import { PrayerTimeService } from './services/prayerTimeService';
import { TimeCalculations } from './utils/timeCalculations';
import { Location, PrayerTimes, TahajjudWindow } from './types';
import { BackgroundAnimation } from './components/BackgroundAnimation';
import { LocationDisplay } from './components/LocationDisplay';
import { PrayerTimeCard } from './components/PrayerTimeCard';
import { CountdownTimer } from './components/CountdownTimer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { ManualTimeDialog } from './components/ManualTimeDialog';
import { CityInputDialog } from './components/CityInputDialog';
import { TooltipProvider } from './components/ui/tooltip';
import { Card, CardContent } from './components/ui/card';

function App() {
  const [location, setLocation] = useState<Location | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [tahajjudWindow, setTahajjudWindow] = useState<TahajjudWindow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isManualMode, setIsManualMode] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const handleCitySet = async (cityName: string) => {
    setLoading(true);
    setError(null);
    setIsManualMode(false);
    
    try {
      // Get location by city name
      const userLocation = await LocationService.getLocationByCity(cityName);
      setLocation(userLocation);
      
      // Get prayer times
      const times = await PrayerTimeService.getPrayerTimes(userLocation);
      setPrayerTimes(times);
      
      // Calculate Tahajjud window
      const tahajjud = TimeCalculations.calculateTahajjudWindow(times.maghrib, times.fajr);
      setTahajjudWindow(tahajjud);
      
      setShowWelcome(false);
    } catch (err) {
      console.error('Error initializing app:', err);
      setError(err instanceof Error ? err.message : 'Failed to load prayer times');
    } finally {
      setLoading(false);
    }
  };

  const handleManualTimesSet = (maghrib: string, fajr: string) => {
    const manualPrayerTimes: PrayerTimes = {
      maghrib,
      fajr,
      date: new Date().toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      hijriDate: 'Manual Entry'
    };
    
    setPrayerTimes(manualPrayerTimes);
    
    const tahajjud = TimeCalculations.calculateTahajjudWindow(maghrib, fajr);
    setTahajjudWindow(tahajjud);
    setIsManualMode(true);
    setShowWelcome(false);
    setError(null);
  };

  const handleRetry = () => {
    setError(null);
    setShowWelcome(true);
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative">
          <BackgroundAnimation />
          <div className="relative z-10">
            <LoadingSpinner />
          </div>
        </div>
      </TooltipProvider>
    );
  }

  if (error) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative">
          <BackgroundAnimation />
          <div className="relative z-10">
            <ErrorMessage message={error} onRetry={handleRetry} />
          </div>
        </div>
      </TooltipProvider>
    );
  }

  if (showWelcome) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative">
          <BackgroundAnimation />
          
          <div className="relative z-10 container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div 
                className="mb-12"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center justify-center gap-3 mb-6">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Moon className="h-12 w-12 text-amber-400" />
                  </motion.div>
                  <motion.h1 
                    className="text-5xl font-bold text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    Tahajjud Timer
                  </motion.h1>
                </div>
                <motion.p 
                  className="text-white/70 text-xl mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  Calculate the blessed last third of the night for your location
                </motion.p>
                
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
                    <CardContent className="p-0">
                      <h2 className="text-white text-lg font-semibold mb-4">Choose how to get your prayer times:</h2>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <CityInputDialog 
                          onCitySet={handleCitySet}
                          currentCity={location?.city}
                        />
                        <span className="text-white/50 self-center">or</span>
                        <ManualTimeDialog 
                          onManualTimesSet={handleManualTimesSet}
                          currentMaghrib={prayerTimes?.maghrib}
                          currentFajr={prayerTimes?.fajr}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              <motion.div 
                className="text-center text-white/60 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <p>The last third of the night is the most blessed time for worship and supplication</p>
              </motion.div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    );
  }
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative">
        <BackgroundAnimation />
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Moon className="h-8 w-8 text-amber-400" />
                </motion.div>
                <motion.h1 
                  className="text-4xl font-bold text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  Tahajjud Timer
                </motion.h1>
              </div>
              <motion.p 
                className="text-white/70 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                The last third of the night - the most blessed time for prayer
              </motion.p>
              
              {/* Action Buttons */}
              <motion.div 
                className="mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <CityInputDialog 
                    onCitySet={handleCitySet}
                    currentCity={location?.city}
                  />
                  <ManualTimeDialog 
                    onManualTimesSet={handleManualTimesSet}
                    currentMaghrib={prayerTimes?.maghrib}
                    currentFajr={prayerTimes?.fajr}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Location and Date */}
            <LocationDisplay 
              location={isManualMode ? { city: 'Manual', country: 'Entry', latitude: 0, longitude: 0 } : location}
              date={prayerTimes?.date || ''}
              hijriDate={prayerTimes?.hijriDate || ''}
            />

            {/* Countdown Timer */}
            <AnimatePresence>
              {tahajjudWindow && (
                <CountdownTimer 
                  tahajjudStart={tahajjudWindow.start}
                  tahajjudEnd={tahajjudWindow.end}
                />
              )}
            </AnimatePresence>

            {/* Prayer Times Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <PrayerTimeCard
                title="Maghrib"
                time={prayerTimes?.maghrib || ''}
                icon={Sunset}
                iconColor="text-orange-400"
              />
              <PrayerTimeCard
                title="Fajr"
                time={prayerTimes?.fajr || ''}
                icon={Sunrise}
                iconColor="text-blue-400"
              />
              <PrayerTimeCard
                title="Tahajjud Starts"
                time={tahajjudWindow?.start || ''}
                icon={Moon}
                iconColor="text-amber-400"
                isHighlighted={true}
              />
              <PrayerTimeCard
                title="Tahajjud Ends"
                time={tahajjudWindow?.end || ''}
                icon={Clock}
                iconColor="text-purple-400"
                isHighlighted={true}
              />
            </motion.div>

            {/* Tahajjud Duration Info */}
            <AnimatePresence>
              {tahajjudWindow && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-center">
                    <CardContent className="p-6">
                      <motion.h3 
                        className="text-lg font-semibold text-white mb-2"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        Tahajjud Window Duration
                      </motion.h3>
                      <motion.p 
                        className="text-2xl font-bold text-amber-400"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {Math.floor(tahajjudWindow.duration / 60)}h {tahajjudWindow.duration % 60}m
                      </motion.p>
                      <p className="text-white/70 text-sm mt-2">
                        The last third of the night - the most blessed time for worship
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <motion.div 
              className="text-center mt-12 text-white/60 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <p>May Allah accept your prayers and grant you spiritual elevation</p>
            </motion.div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default App;