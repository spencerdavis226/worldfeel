import { z } from 'zod';
import { EmotionColorMap, resolveEmotionKey } from './emotion-color-map.js';

export const submissionRequestSchema = z.object({
  word: z
    .string()
    .min(1, 'Word is required')
    .max(20, 'Word must be 20 characters or less')
    // Resolve to canonical emotion key if alias/variant is provided
    .transform((w) => resolveEmotionKey(w) ?? w)
    .refine(
      (w) => EmotionColorMap.has(w as any),
      'Please select a valid emotion'
    ),
});

export const statsQuerySchema = z.object({
  yourWord: z.string().optional(),
});

export const colorQuerySchema = z.object({
  word: z.string().min(1, 'Word is required'),
});
