import { Location } from '../types';

interface LocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  admin2?: string;
}

export class LocationService {
  static async searchLocations(query: string): Promise<LocationResult[]> {
    if (query.length < 2) return [];
    
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`
      );
      const data = await response.json();
      
      return data.results || [];
    } catch (error) {
      console.error('Error searching locations:', error);
      return [];
    }
  }

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

  static async getLocationById(locationResult: LocationResult): Promise<Location> {
    return {
      latitude: locationResult.latitude,
      longitude: locationResult.longitude,
      city: locationResult.name,
      country: locationResult.country
    };
  }
}