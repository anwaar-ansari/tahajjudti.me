import { Location } from '../types';

export class LocationService {
  static async getLocationByCity(cityName: string): Promise<Location> {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          latitude: result.latitude,
          longitude: result.longitude,
          city: result.name,
          country: result.country
        };
      } else {
        throw new Error('City not found');
      }
    } catch (error) {
      throw new Error(`Failed to find location for ${cityName}`);
    }
  }
}