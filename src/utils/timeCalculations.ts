import { TahajjudWindow } from '../types';

export class TimeCalculations {
  static calculateTahajjudWindow(maghribTime: string, fajrTime: string): TahajjudWindow {
    const maghrib = this.parseTime(maghribTime);
    const fajr = this.parseTime(fajrTime);
    
    // If fajr is before maghrib, it's the next day
    if (fajr < maghrib) {
      fajr.setDate(fajr.getDate() + 1);
    }
    
    const nightDuration = fajr.getTime() - maghrib.getTime();
    const thirdOfNight = nightDuration / 3;
    
    // Last third starts at maghrib + (2/3 of night)
    const tahajjudStart = new Date(maghrib.getTime() + (thirdOfNight * 2));
    const tahajjudEnd = new Date(fajr.getTime());
    
    return {
      start: this.formatTime(tahajjudStart),
      end: this.formatTime(tahajjudEnd),
      duration: Math.round(thirdOfNight / (1000 * 60)) // in minutes
    };
  }

  static parseTime(timeString: string): Date {
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    const date = new Date();
    let adjustedHours = hours;
    
    if (period === 'PM' && hours !== 12) {
      adjustedHours = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      adjustedHours = 0;
    }
    
    date.setHours(adjustedHours, minutes, 0, 0);
    return date;
  }

  static formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  static getCountdownToTime(targetTime: string): {
    hours: number;
    minutes: number;
    seconds: number;
    isActive: boolean;
    message: string;
  } {
    const now = new Date();
    const target = this.parseTime(targetTime);
    
    // If target is earlier in the day, it's tomorrow
    if (target < now) {
      target.setDate(target.getDate() + 1);
    }
    
    const diff = target.getTime() - now.getTime();
    
    if (diff <= 0) {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
        isActive: false,
        message: 'Time has passed'
      };
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return {
      hours,
      minutes,
      seconds,
      isActive: true,
      message: ''
    };
  }

  static isCurrentlyTahajjudTime(tahajjudStart: string, tahajjudEnd: string): boolean {
    const now = new Date();
    const start = this.parseTime(tahajjudStart);
    const end = this.parseTime(tahajjudEnd);
    
    // Handle case where tahajjud spans midnight
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
    
    return now >= start && now <= end;
  }
}