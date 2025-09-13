import * as Location from 'expo-location';
import { CONFIG } from '../../config';

export const locationService = {
  async requestLocationPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  },

  async getCurrentLocation() {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        throw new Error('Location permission denied');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: CONFIG.LOCATION.TIMEOUT,
        maximumAge: CONFIG.LOCATION.MAXIMUM_AGE,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      throw new Error('Unable to get current location');
    }
  },

  async reverseGeocode(latitude, longitude) {
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (result && result.length > 0) {
        const address = result[0];
        const addressParts = [];
        
        if (address.name) addressParts.push(address.name);
        if (address.street) addressParts.push(address.street);
        if (address.district) addressParts.push(address.district);
        if (address.city) addressParts.push(address.city);
        if (address.region) addressParts.push(address.region);
        
        return addressParts.join(', ') || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      }
      
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  },

  async searchLocations(query) {
    try {
      if (query.length < 3) return [];

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=IN&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'CivicEye-App/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch location suggestions');
      }

      const data = await response.json();
      return data.map(item => ({
        id: item.place_id,
        displayName: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        formatted: this.formatLocationName(item),
      }));
    } catch (error) {
      console.error('Error searching locations:', error);
      return [];
    }
  },

  formatLocationName(item) {
    const address = item.address || {};
    const parts = [];
    
    if (address.building) parts.push(address.building);
    if (address.house_number && address.road) {
      parts.push(`${address.house_number} ${address.road}`);
    } else if (address.road) {
      parts.push(address.road);
    }
    if (address.suburb) parts.push(address.suburb);
    if (address.city || address.town || address.village) {
      parts.push(address.city || address.town || address.village);
    }
    if (address.state) parts.push(address.state);
    
    return parts.slice(0, 3).join(', ') || item.display_name.split(',').slice(0, 3).join(',').trim();
  },

  async getLocationFromCoords(latitude, longitude) {
    try {
      const address = await this.reverseGeocode(latitude, longitude);
      return {
        latitude,
        longitude,
        address,
        formatted: address,
      };
    } catch (error) {
      console.error('Error getting location from coordinates:', error);
      return {
        latitude,
        longitude,
        address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        formatted: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      };
    }
  }
};
