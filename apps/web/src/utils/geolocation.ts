import type { GeoLocation } from '@worldfeel/shared';
import { apiClient } from './api.js';

/**
 * Get user's location via browser geolocation API
 */
export async function getBrowserLocation(): Promise<GeoLocation | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Reverse geocode using browser's Intl API for friendly names
          const location: GeoLocation = {
            latitude,
            longitude,
          };

          // Try to get country/region names using Intl.DisplayNames if available
          try {
            // This is a simplified approach - in a real app you might want to use
            // a proper reverse geocoding service
            location.country = 'Unknown';
            location.region = 'Unknown';
            location.city = 'Unknown';
          } catch (error) {
            console.warn('Could not resolve location names:', error);
          }

          resolve(location);
        } catch (error) {
          console.error('Error processing geolocation:', error);
          resolve(null);
        }
      },
      (error) => {
        console.warn('Geolocation denied or failed:', error.message);
        resolve(null);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
}

/**
 * Get location via IP fallback
 */
export async function getIPLocation(): Promise<GeoLocation | null> {
  try {
    const response = await apiClient.getGeoLocation();
    return response.success ? response.data || null : null;
  } catch (error) {
    console.warn('IP geolocation failed:', error);
    return null;
  }
}

/**
 * Get location with browser first, then IP fallback
 */
export async function getLocation(): Promise<GeoLocation | null> {
  try {
    // Try browser geolocation first
    const browserLocation = await getBrowserLocation();
    if (browserLocation) {
      return browserLocation;
    }

    // Fall back to IP geolocation
    const ipLocation = await getIPLocation();
    if (ipLocation) {
      return ipLocation;
    }

    return null;
  } catch (error) {
    console.error('Location detection failed:', error);
    return null;
  }
}

/**
 * Check if geolocation is supported and permission is granted
 */
export function isGeolocationSupported(): boolean {
  return 'geolocation' in navigator;
}

/**
 * Check geolocation permission status
 */
export async function checkGeolocationPermission(): Promise<PermissionState | null> {
  if (!('permissions' in navigator)) {
    return null;
  }

  try {
    const permission = await navigator.permissions.query({ name: 'geolocation' });
    return permission.state;
  } catch (error) {
    console.warn('Could not check geolocation permission:', error);
    return null;
  }
}
