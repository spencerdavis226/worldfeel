import { sha256 } from 'js-sha256';
import { env } from '../config/env.js';

/**
 * Generate a day salt from the current UTC date and secret
 */
function getDaySalt(): string {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  return sha256(today + env.DAY_SALT_SECRET);
}

/**
 * Hash an IP address with the day salt for privacy
 */
export function hashIp(ip: string): string {
  const daySalt = getDaySalt();
  return sha256(ip + daySalt);
}

/**
 * Get client IP address from request, considering proxies
 */
export function getClientIp(req: {
  ip?: string | undefined;
  connection?: { remoteAddress?: string | undefined } | undefined;
  socket?: { remoteAddress?: string | undefined } | undefined;
}): string {
  return (
    req.ip ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    '0.0.0.0'
  );
}
