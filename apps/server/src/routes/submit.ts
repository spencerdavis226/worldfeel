import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { submissionRequestSchema } from '@worldfeel/shared';
import { Submission, type SubmissionDocument } from '../models/Submission.js';
import { hashIp, getClientIp } from '../utils/crypto.js';
import { containsProfanity } from '../utils/profanity.js';
import { getStats, invalidateStatsCache } from './stats.js';
import { env } from '../config/env.js';

const router = Router();

interface SubmitRequest extends Request {
  body: {
    word: string;
    deviceId?: string;
  };
}

const EDIT_WINDOW_MINUTES = 5;

function getCooldownRemainingSeconds(lastCreatedAt?: Date): number {
  if (!lastCreatedAt) return 0;

  // Use shorter cooldown for development/testing
  const cooldownSeconds =
    env.NODE_ENV === 'production' ? env.SUBMIT_COOLDOWN_SECONDS : 15; // 15 seconds for development

  const elapsedMs = Date.now() - new Date(lastCreatedAt).getTime();
  const remainingMs = cooldownSeconds * 1000 - elapsedMs;
  return Math.max(0, Math.ceil(remainingMs / 1000));
}

async function findLatestSubmission(
  ipHash: string,
  deviceId?: string
): Promise<SubmissionDocument | null> {
  const filter: {
    $or?: Array<{ deviceId: string } | { ipHash: string }>;
    ipHash?: string;
  } = deviceId ? { $or: [{ deviceId }, { ipHash }] } : { ipHash };
  return Submission.findOne(filter).sort({ createdAt: -1 }).exec();
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

    // Enforce cooldown: check latest submission by deviceId or ipHash
    const latest = await findLatestSubmission(ipHash, deviceId);
    const remaining = getCooldownRemainingSeconds(latest?.createdAt as any);
    if (remaining > 0) {
      res.status(429).json({
        success: false,
        error: 'Cooldown active',
        message: `You can submit again in ${remaining} seconds`,
        remainingSeconds: remaining,
        nextSubmitAt: new Date(Date.now() + remaining * 1000).toISOString(),
      });
      return;
    }

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
    const statsQuery: { yourWord: string } = { yourWord: word };

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

// Status endpoint to check if user can submit based on cooldown
router.get('/status', async (req: Request, res: Response): Promise<void> => {
  try {
    // Prefer explicit deviceId query; fallback to cookie
    const deviceIdQuery =
      (req.query.deviceId as string | undefined) || undefined;
    const deviceIdCookie = (req as any).cookies?.['hwf.sid'] as
      | string
      | undefined;
    const deviceId = deviceIdQuery || deviceIdCookie;

    const clientIp = getClientIp(req);
    const ipHash = hashIp(clientIp);

    const latest = await findLatestSubmission(ipHash, deviceId);
    const remaining = getCooldownRemainingSeconds(latest?.createdAt as any);
    const canSubmit = remaining === 0;

    res.json({
      success: true,
      data: {
        canSubmit,
        remainingSeconds: remaining,
        nextSubmitAt: canSubmit
          ? null
          : new Date(Date.now() + remaining * 1000).toISOString(),
      },
    });
  } catch (error) {
    console.error('Submit status error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Unable to determine submission status',
    });
  }
});

export default router;
