import { Router } from 'express';
import submitRouter from './submit.js';
import statsRouter from './stats.js';
import colorRouter from './color.js';
import flagRouter from './flag.js';
import { UnknownEmotion } from '../models/UnknownEmotion.js';

const router = Router();

// Mount all API routes
router.use('/submit', submitRouter);
router.use('/stats', statsRouter);
router.use('/color', colorRouter);
router.use('/flag', flagRouter);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Simple admin endpoint to view recent unknown emotions (no auth for now; up to 100)
router.get('/admin/unknown-emotions', async (_req, res) => {
  try {
    const items = await UnknownEmotion.find()
      .sort({ lastSeenAt: -1 })
      .limit(100)
      .lean();
    res.json({ success: true, data: items });
  } catch (error) {
    console.error('Unknown emotions fetch error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
