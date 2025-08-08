import { z } from 'zod';
import { EmotionColorMap, resolveEmotionKey } from './emotion-color-map.js';

// Helper to validate letters only using Unicode property escapes
export const lettersOnlyRegex = /^[\p{L}]{1,20}$/u;

export const wordSchema = z
  .string()
  .min(1, 'Word is required')
  .max(20, 'Word must be 20 characters or less')
  .refine(
    (word) => lettersOnlyRegex.test(word),
    'Word must contain only letters'
  )
  .transform((word) => word.toLowerCase().trim());

export const deviceIdSchema = z
  .string()
  .uuid('Invalid device ID format')
  .optional();

export const submissionRequestSchema = z.object({
  word: z
    .string()
    .min(1, 'Word is required')
    .max(20, 'Word must be 20 characters or less')
    .refine((w) => lettersOnlyRegex.test(w), 'Word must contain only letters')
    .transform((w) => w.toLowerCase().trim())
    // Resolve to canonical emotion key if alias/variant is provided
    .transform((w) => resolveEmotionKey(w) ?? w)
    .refine(
      (w) => EmotionColorMap.has(w as any),
      'Please select a valid emotion'
    ),
  deviceId: deviceIdSchema,
});

export const statsQuerySchema = z.object({
  yourWord: wordSchema.optional(),
});

export const colorQuerySchema = z.object({
  word: wordSchema,
});

// Helper function to validate if a word contains only letters
export function lettersOnly(word: string): boolean {
  return lettersOnlyRegex.test(word);
}

// Type exports for use in other parts of the app (defined in types.ts)
// export type SubmissionRequest = z.infer<typeof submissionRequestSchema>;
// export type StatsQuery = z.infer<typeof statsQuerySchema>;
// export type ColorQuery = z.infer<typeof colorQuerySchema>;
