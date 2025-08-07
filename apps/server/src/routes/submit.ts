import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { submissionRequestSchema, wordToColor, generatePalette } from '@worldfeel/shared';
import { Submission } from '../models/Submission.js';
import { hashIp, getClientIp } from '../utils/crypto.js';
import { containsProfanity } from '../utils/profanity.js';
import { getStats } from './stats.js';

const router = Router();

interface SubmitRequest extends Request {
  body: {
    word: string;
    country?: string;
    region?: string;
    city?: string;
    deviceId?: string;
  };
}

const EDIT_WINDOW_MINUTES = 5;

router.post('/', async (req: SubmitRequest, res: Response) => {
  try {
    // Validate request body
    const validationResult = submissionRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        message: validationResult.error.errors[0]?.message || 'Validation failed'
      });
    }

    const { word, country, region, city } = validationResult.data;
    let { deviceId } = validationResult.data;

    // Check for profanity
    if (containsProfanity(word)) {
      return res.status(400).json({
        success: false,
        error: 'Inappropriate content',
        message: 'Please choose a different word'
      });
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
        path: '/'
      });
    }

    const clientIp = getClientIp(req);
    const ipHash = hashIp(clientIp);

    // Check for existing submission
    const existingSubmission = await Submission.findOne({
      $or: [
        { ipHash },
        ...(deviceId ? [{ deviceId }] : [])
      ],
      expiresAt: { $gt: new Date() } // Still active
    }).sort({ createdAt: -1 });

    const now = new Date();

    if (existingSubmission) {
      // Check if within edit window
      const submissionAge = (now.getTime() - existingSubmission.createdAt.getTime()) / (1000 * 60); // minutes

      if (submissionAge <= EDIT_WINDOW_MINUTES) {
        // Update existing submission
        existingSubmission.word = word;
        existingSubmission.country = country;
        existingSubmission.region = region;
        existingSubmission.city = city;
        await existingSubmission.save();

        // Get updated stats
        const stats = await getStats({ country, region, city, yourWord: word });

        return res.json({
          success: true,
          data: stats,
          message: 'Word updated successfully',
          canEdit: true,
          editWindowMinutes: EDIT_WINDOW_MINUTES
        });
      } else {
        // Outside edit window, return current submission stats
        const stats = await getStats({
          country: existingSubmission.country,
          region: existingSubmission.region,
          city: existingSubmission.city,
          yourWord: existingSubmission.word
        });

        return res.status(409).json({
          success: false,
          error: 'Already submitted',
          message: `You've already shared your feeling today: "${existingSubmission.word}"`,
          data: stats,
          canEdit: false
        });
      }
    }

    // Create new submission
    const submission = new Submission({
      word,
      country,
      region,
      city,
      ipHash,
      deviceId,
      createdAt: now,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours
    });

    await submission.save();

    // Get stats for response
    const stats = await getStats({ country, region, city, yourWord: word });

    res.status(201).json({
      success: true,
      data: stats,
      message: 'Thank you for sharing how you feel!',
      canEdit: true,
      editWindowMinutes: EDIT_WINDOW_MINUTES
    });

  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Something went wrong. Please try again.'
    });
  }
});

export default router;
