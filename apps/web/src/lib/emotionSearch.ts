import { getSearchTerms } from '@worldfeel/shared/emotion-color-map';

// Get all available emotion words from the emotion system
const EMOTION_WORDS = getSearchTerms();

/**
 * Search for emotions based on a query string.
 * Returns up to 12 matching emotions, prioritized by exact matches first.
 */
export function searchEmotions(query: string): string[] {
  const results: string[] = [];
  const queryLower = query.toLowerCase();

  // Add exact matches first (canonical emotions)
  const exactMatches = EMOTION_WORDS.filter((word) =>
    word.toLowerCase().includes(queryLower)
  );

  // Add partial matches (aliases and variants)
  const partialMatches = EMOTION_WORDS.filter(
    (word) =>
      word.toLowerCase().startsWith(queryLower) && !exactMatches.includes(word)
  );

  // Combine and limit results
  results.push(...exactMatches, ...partialMatches);
  return results.slice(0, 12);
}
