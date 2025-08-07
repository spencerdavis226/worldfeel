import { v4 as uuidv4 } from 'uuid';

const DEVICE_ID_KEY = 'hwf.sid';

/**
 * Get or create device ID from cookie
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

  // Create new device ID
  const deviceId = uuidv4();
  setDeviceIdCookie(deviceId);
  return deviceId;
}

/**
 * Set device ID cookie
 */
function setDeviceIdCookie(deviceId: string): void {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1); // 1 year

  document.cookie = `${DEVICE_ID_KEY}=${deviceId}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * Clear device ID (for testing or privacy)
 */
export function clearDeviceId(): void {
  document.cookie = `${DEVICE_ID_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}
