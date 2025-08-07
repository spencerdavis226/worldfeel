import { Router } from 'express';
import submitRouter from './submit.js';
import statsRouter from './stats.js';
import colorRouter from './color.js';
import geoipRouter from './geoip.js';
import flagRouter from './flag.js';

const router = Router();

// Mount all API routes
router.use('/submit', submitRouter);
router.use('/stats', statsRouter);
router.use('/color', colorRouter);
router.use('/geoip', geoipRouter);
router.use('/flag', flagRouter);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
