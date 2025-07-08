import { Location } from '../types';

export class LocationService {
  static async getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocoding to get city name
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            
            resolve({
              latitude,
              longitude,
              city: data.city || data.locality || 'Unknown',
              country: data.countryName || 'Unknown'
            });
          } catch (error) {
            resolve({
              latitude,
              longitude,
              city: 'Unknown',
              country: 'Unknown'
            });
          }
        },
        (error) => {
          reject(new Error(`Location access denied: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  static async getLocationByCity(cityName: string): Promise<Location> {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/geo-search?query=${encodeURIComponent(cityName)}&limit=1`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          latitude: result.latitude,
          longitude: result.longitude,
          city: result.name,
          country: result.countryName
        };
      } else {
        throw new Error('City not found');
      }
    } catch (error) {
      throw new Error(`Failed to find location for ${cityName}`);
    }
  }
}