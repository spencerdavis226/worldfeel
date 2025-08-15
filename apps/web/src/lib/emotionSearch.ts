import {
  getSearchTerms,
  resolveEmotionKey,
} from '@worldfeel/shared/emotion-color-map';

// Get all available emotion words from the emotion system (canonical + aliases for search)
const ALL_SEARCH_TERMS = getSearchTerms();

/**
 * Simple Levenshtein distance calculation for fuzzy matching
 * Optimized for short strings (emotion words are typically 3-15 characters)
 */
function levenshteinDistance(a: string, b: string): number {
  const al = a.length;
  const bl = b.length;

  if (al === 0) return bl;
  if (bl === 0) return al;

  const matrix = Array(al + 1)
    .fill(null)
    .map(() => Array(bl + 1).fill(null));

  for (let i = 0; i <= al; i++) matrix[i][0] = i;
  for (let j = 0; j <= bl; j++) matrix[0][j] = j;

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[al][bl];
}

/**
 * Search for emotions based on a query string.
 * Returns up to 12 matching canonical emotions, prioritized by:
 * 1. Exact matches first
 * 2. Prefix matches
 * 3. Substring matches
 * 4. Fuzzy matches (typos/misspellings)
 * Aliases help with search matching but are resolved to their canonical forms.
 */
export function searchEmotions(query: string): string[] {
  const results: string[] = [];
  const queryLower = query.toLowerCase();

  // Resolve all terms to canonical emotions and deduplicate
  const canonicalMatches = new Set<string>();

  for (const term of ALL_SEARCH_TERMS) {
    const canonical = resolveEmotionKey(term);
    if (canonical) {
      canonicalMatches.add(canonical);
    }
  }

  // Convert to array and categorize matches
  const allMatches = Array.from(canonicalMatches);

  // 1. Exact matches first
  const exactMatches = allMatches.filter(
    (word) => word.toLowerCase() === queryLower
  );

  // 2. Prefix matches
  const prefixMatches = allMatches.filter(
    (word) =>
      word.toLowerCase().startsWith(queryLower) && !exactMatches.includes(word)
  );

  // 3. Substring matches
  const substringMatches = allMatches.filter(
    (word) =>
      word.toLowerCase().includes(queryLower) &&
      !exactMatches.includes(word) &&
      !prefixMatches.includes(word)
  );

  // 4. Fuzzy matches (for typos/misspellings)
  const fuzzyMatches: Array<{ word: string; distance: number }> = [];
  const maxDistance = Math.max(2, Math.floor(queryLower.length / 3)); // Adaptive threshold

  for (const word of allMatches) {
    if (
      !exactMatches.includes(word) &&
      !prefixMatches.includes(word) &&
      !substringMatches.includes(word)
    ) {
      const distance = levenshteinDistance(queryLower, word.toLowerCase());
      if (distance <= maxDistance) {
        fuzzyMatches.push({ word, distance });
      }
    }
  }

  // Sort fuzzy matches by distance
  fuzzyMatches.sort((a, b) => a.distance - b.distance);
  const fuzzyWords = fuzzyMatches.map((m) => m.word);

  // Combine all results in priority order
  results.push(
    ...exactMatches,
    ...prefixMatches,
    ...substringMatches,
    ...fuzzyWords
  );

  return results.slice(0, 12);
}
