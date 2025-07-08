import { Location, PrayerTimes } from '../types';

export class PrayerTimeService {
  private static readonly BASE_URL = 'https://api.aladhan.com/v1';

  static async getPrayerTimes(location: Location): Promise<PrayerTimes> {
    try {
      const today = new Date();
      const response = await fetch(
        `${this.BASE_URL}/timings/${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}?latitude=${location.latitude}&longitude=${location.longitude}&method=2`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch prayer times');
      }

      const data = await response.json();
      const timings = data.data.timings;
      const hijriDate = data.data.date.hijri;
      const gregorianDate = data.data.date.gregorian;

      return {
        maghrib: timings.Maghrib,
        fajr: timings.Fajr,
        date: `${gregorianDate.day} ${gregorianDate.month.en} ${gregorianDate.year}`,
        hijriDate: `${hijriDate.day} ${hijriDate.month.en} ${hijriDate.year} AH`
      };
    } catch (error) {
      throw new Error(`Failed to get prayer times: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}