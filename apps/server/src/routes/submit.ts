import { Router, Request, Response } from 'express';
import { submissionRequestSchema } from '@worldfeel/shared';
import { Submission } from '../models/Submission.js';
import { hashIp, getClientIp } from '../utils/crypto.js';
import { getStats, invalidateStatsCache } from './stats.js';
import { env } from '../config/env.js';

const router = Router();

interface SubmitRequest extends Request {
  body: {
    word: string;
  };
}

router.post('/', async (req: SubmitRequest, res: Response): Promise<void> => {
  try {
    // Validate request body
    const validationResult = submissionRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid input',
        message:
          validationResult.error.errors[0]?.message || 'Validation failed',
      });
      return;
    }

    const { word } = validationResult.data;

    const clientIp = getClientIp(req);
    const ipHash = hashIp(clientIp);

    // Log submission for debugging
    if (env.NODE_ENV === 'development') {
      console.log('Submission attempt:', {
        ipHash: `${ipHash.substring(0, 8)}...`,
        word,
      });
    }

    const now = new Date();

    // Create new submission
    const submission = new Submission({
      word,
      ipHash,
      createdAt: now,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours
    });

    await submission.save();

    // Invalidate stats cache so subsequent GET /stats reflects the new submission
    invalidateStatsCache();

    // Get stats for response
    const statsQuery: { yourWord: string } = { yourWord: word };

    const stats = await getStats(statsQuery);

    res.status(201).json({
      success: true,
      data: stats,
      message: 'Thank you for sharing how you feel!',
      canEdit: true,
      editWindowMinutes: 5,
    });
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Something went wrong. Please try again.',
    });
  }
});

export default router;
