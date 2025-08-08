import { Router, Request, Response } from 'express';
import { colorQuerySchema, getEmotionColor } from '@worldfeel/shared';

const router = Router();

interface ColorRequest extends Request {
  query: {
    word: string;
  };
}

router.get('/', async (req: ColorRequest, res: Response): Promise<void> => {
  try {
    // Validate query parameters
    const validationResult = colorQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        message:
          validationResult.error.errors[0]?.message || 'Word is required',
      });
      return;
    }

    const { word } = validationResult.data;
    const hex = getEmotionColor(word);
    if (!hex) {
      // Should not happen if validation enforced list, but guard anyway
      res.status(404).json({ success: false, error: 'Unknown emotion' });
      return;
    }
    res.json({ success: true, data: { hex } });
  } catch (error) {
    console.error('Color error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Unable to generate color',
    });
  }
});

export default router;
