import { Router, Request, Response } from 'express';

const router = Router();

// No-op flag endpoint for future moderation features
router.post('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    // For now, just return success
    // In the future, this could handle content flagging for moderation

    res.json({
      success: true,
      message: 'Report received',
    });
  } catch (error) {
    console.error('Flag error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Unable to process report',
    });
  }
});

export default router;
