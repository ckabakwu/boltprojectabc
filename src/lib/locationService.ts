import { supabase } from './supabase';

interface Location {
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
}

class LocationService {
  private static instance: LocationService;

  private constructor() {}

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  public async detectLocation(): Promise<Location | null> {
    try {
      // Try to get location from browser geolocation API
      const position = await this.getCurrentPosition();
      if (!position) return null;

      // Reverse geocode coordinates
      const location = await this.reverseGeocode(position.coords.latitude, position.coords.longitude);
      
      if (location) {
        // Cache the location in localStorage
        localStorage.setItem('userLocation', JSON.stringify(location));
        return location;
      }

      return null;
    } catch (error) {
      console.error('Error detecting location:', error);
      return null;
    }
  }

  public async getLocationByZip(zipCode: string): Promise<Location | null> {
    try {
      // Check if location exists in service areas
      const { data, error } = await supabase
        .from('service_locations')
        .select('*')
        .eq('type', 'zipcode')
        .eq('zipcode', zipCode)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        city: data.city,
        state: data.state,
        zipCode: data.zipcode,
        latitude: data.center_point[1],
        longitude: data.center_point[0]
      };
    } catch (error) {
      console.error('Error getting location by zip:', error);
      return null;
    }
  }

  private getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
  }

  private async reverseGeocode(lat: number, lon: number): Promise<Location | null> {
    try {
      // Check if coordinates are within any service area
      const { data, error } = await supabase.rpc('find_service_area_by_coords', {
        lat,
        lon
      });

      if (error) throw error;
      if (!data) return null;

      return {
        city: data.city,
        state: data.state,
        zipCode: data.zipcode,
        latitude: lat,
        longitude: lon
      };
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  public getCachedLocation(): Location | null {
    const cached = localStorage.getItem('userLocation');
    return cached ? JSON.parse(cached) : null;
  }
}

export const locationService = LocationService.getInstance();