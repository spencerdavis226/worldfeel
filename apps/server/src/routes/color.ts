import { Router, Request, Response } from 'express';
import { colorQuerySchema, wordToColor } from '@worldfeel/shared';

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
        message: validationResult.error.errors[0]?.message || 'Word is required'
      });
      return;
    }

    const { word } = validationResult.data;
    const colors = wordToColor(word);

    res.json({
      success: true,
      data: colors
    });

  } catch (error) {
    console.error('Color error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Unable to generate color'
    });
  }
});

export default router;
