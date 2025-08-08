import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { submissionRequestSchema } from '@worldfeel/shared';
import { Submission } from '../models/Submission.js';
import { hashIp, getClientIp } from '../utils/crypto.js';
import { containsProfanity } from '../utils/profanity.js';
import { getStats, invalidateStatsCache } from './stats.js';

const router = Router();

interface SubmitRequest extends Request {
  body: {
    word: string;
    deviceId?: string;
  };
}

const EDIT_WINDOW_MINUTES = 5;

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
    let { deviceId } = validationResult.data;

    // Check for profanity
    if (containsProfanity(word)) {
      res.status(400).json({
        success: false,
        error: 'Inappropriate content',
        message: 'Please choose a different word',
      });
      return;
    }

    // Generate device ID if not provided
    if (!deviceId) {
      deviceId = uuidv4();

      // Set device ID cookie
      res.cookie('hwf.sid', deviceId, {
        httpOnly: false, // Client needs to read this
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        path: '/',
      });
    }

    const clientIp = getClientIp(req);
    const ipHash = hashIp(clientIp);

    // Existing-submission edit flow is currently disabled (simplified global model)

    const now = new Date();

    // Create new submission
    const submission = new Submission({
      word,
      ipHash,
      deviceId,
      createdAt: now,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours
    });

    await submission.save();

    // Invalidate stats cache so subsequent GET /stats reflects the new submission
    invalidateStatsCache();

    // Get stats for response
    const statsQuery: any = { yourWord: word };

    const stats = await getStats(statsQuery);

    res.status(201).json({
      success: true,
      data: stats,
      message: 'Thank you for sharing how you feel!',
      canEdit: true,
      editWindowMinutes: EDIT_WINDOW_MINUTES,
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
