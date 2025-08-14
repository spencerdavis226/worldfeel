import { v4 as uuidv4 } from 'uuid';

const DEVICE_ID_KEY = 'hwf.sid';

/**
 * Generate a simple device fingerprint based on available browser characteristics
 * This helps distinguish between different devices even when cookies are cleared
 */
function generateDeviceFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 'unknown',
    // Use more compatible properties
    navigator.platform || 'unknown',
    navigator.cookieEnabled ? 'cookies-on' : 'cookies-off',
    'ontouchstart' in window ? 'touch' : 'no-touch',
  ];

  // Create a simple hash of the components
  const combined = components.join('|');
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36);
}

/**
 * Get or create device ID from cookie
 * Uses a more reliable approach with localStorage fallback and device fingerprinting
 */
export function getDeviceId(): string {
  // Try to get from cookie first
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === DEVICE_ID_KEY && value) {
      return value;
    }
  }

  // Try localStorage as fallback
  try {
    const storedId = localStorage.getItem(DEVICE_ID_KEY);
    if (storedId) {
      // Sync to cookie for consistency
      setDeviceIdCookie(storedId);
      return storedId;
    }
  } catch {
    // Ignore localStorage errors
  }

  // Create new device ID with fingerprint prefix for better identification
  const fingerprint = generateDeviceFingerprint();
  const deviceId = `${fingerprint}-${uuidv4()}`;

  // Try to set cookie, but don't fail if it doesn't work
  try {
    setDeviceIdCookie(deviceId);
  } catch (error) {
    console.warn('Failed to set device ID cookie:', error);
  }

  // Also store in localStorage as backup
  try {
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  } catch {
    // Ignore localStorage errors
  }

  return deviceId;
}

/**
 * Set device ID cookie with improved settings
 */
function setDeviceIdCookie(deviceId: string): void {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1); // 1 year

  // Use more compatible cookie settings for embedded browsers
  const secure = window.location.protocol === 'https:';
  const sameSite = 'Lax'; // Use 'Lax' for better compatibility with embedded browsers

  const cookieString = `${DEVICE_ID_KEY}=${deviceId}; expires=${expires.toUTCString()}; path=/; SameSite=${sameSite}${secure ? '; Secure' : ''}`;

  try {
    document.cookie = cookieString;

    // Verify cookie was set (helpful for debugging embedded browser issues)
    const cookies = document.cookie.split(';');
    const wasSet = cookies.some((cookie) => {
      const [name] = cookie.trim().split('=');
      return name === DEVICE_ID_KEY;
    });

    if (!wasSet) {
      console.warn('Device ID cookie may not have been set properly');
    }
  } catch (error) {
    console.error('Failed to set device ID cookie:', error);
  }
}

/**
 * Clear device ID (for testing or privacy)
 */
export function clearDeviceId(): void {
  // Clear cookie
  document.cookie = `${DEVICE_ID_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

  // Clear localStorage
  try {
    localStorage.removeItem(DEVICE_ID_KEY);
  } catch {
    // Ignore localStorage errors
  }
}
