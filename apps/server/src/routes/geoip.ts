import { Router, Request, Response } from 'express';
import { env } from '../config/env.js';
import { getClientIp } from '../utils/crypto.js';

const router = Router();

interface GeoIPResponse {
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  error?: string;
}

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if IP fallback is enabled
    if (!env.ENABLE_IP_FALLBACK) {
      res.status(404).json({
        success: false,
        error: 'Feature disabled',
        message: 'IP-based location detection is disabled'
      });
      return;
    }

    const clientIp = getClientIp(req);

    // Don't try to geolocate local IPs
    if (clientIp === '127.0.0.1' || clientIp === '::1' || clientIp.startsWith('192.168.') || clientIp.startsWith('10.') || clientIp === '0.0.0.0') {
      res.json({
        success: true,
        data: {
          country: 'Unknown',
          region: 'Unknown',
          city: 'Unknown',
          latitude: 0,
          longitude: 0
        } as GeoIPResponse
      });
      return;
    }

    // Fetch from IP geolocation service
    const response = await fetch(`${env.IP_FALLBACK_URL}${clientIp}`, {
      headers: {
        'User-Agent': 'WorldFeel/1.0',
        'Accept': 'application/json'
      },
      timeout: 5000 // 5 second timeout
    } as any);

    if (!response.ok) {
      throw new Error(`Geolocation service responded with ${response.status}`);
    }

    const data = await response.json();

    // Map the response to our format (assuming ipapi.co format)
    const latitude = data.latitude ? parseFloat(data.latitude) : undefined;
    const longitude = data.longitude ? parseFloat(data.longitude) : undefined;

    const geoData: GeoIPResponse = {
      country: data.country_name || data.country,
      region: data.region || data.region_name,
      city: data.city,
      ...(latitude !== undefined && { latitude }),
      ...(longitude !== undefined && { longitude })
    };

    res.json({
      success: true,
      data: geoData
    });

  } catch (error) {
    console.error('GeoIP error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to determine location',
      message: 'Location detection failed'
    });
  }
});

export default router;
