export interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

export interface PrayerTimes {
  maghrib: string;
  fajr: string;
  date: string;
  hijriDate: string;
}

export interface TahajjudWindow {
  start: string;
  end: string;
  duration: number; // in minutes
}

export interface CountdownData {
  hours: number;
  minutes: number;
  seconds: number;
  isActive: boolean;
  message: string;
}