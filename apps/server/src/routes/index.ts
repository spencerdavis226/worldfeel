import { Router } from 'express';
import submitRouter from './submit.js';
import statsRouter from './stats.js';
import colorRouter from './color.js';
import { getStats } from './stats.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Mount all API routes
router.use('/submit', submitRouter);
router.use('/stats', statsRouter);
router.use('/color', colorRouter);
// router.use('/flag', flagRouter); // DISABLED - POST endpoint

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Rate limiter specifically for public API (more generous than global)
const publicApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute for public API
  message: {
    success: false,
    error: 'Too many requests',
    message: 'Please slow down and try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public API endpoint for emotion and color of the day
router.get(
  '/public/emotion-of-the-day',
  publicApiLimiter,
  async (_req, res) => {
    try {
      // Set CORS headers for public API access
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Headers', 'Content-Type');

      const stats = await getStats();

      res.json({
        success: true,
        data: {
          emotion: stats.top.word,
          color: stats.colorHex,
          count: stats.top.count,
          total: stats.total,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Public API error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Unable to fetch emotion of the day',
      });
    }
  }
);

export default router;
