import { Stats, WordCount, YourWordStats } from '@worldfeel/shared';
import {
  getEmotionColor,
  getSearchTerms,
} from '@worldfeel/shared/emotion-color-map';

// Get all available emotion words from the emotion system
const EMOTION_WORDS = getSearchTerms();

// Generate a random emotion word
function getRandomEmotion(): string {
  return EMOTION_WORDS[Math.floor(Math.random() * EMOTION_WORDS.length)];
}

// Generate a random count between min and max
function getRandomCount(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a random color hex
function getRandomColorHex(): string {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E9',
    '#F8C471',
    '#82E0AA',
    '#F1948A',
    '#85C1E9',
    '#D7BDE2',
    '#FAD7A0',
    '#A9DFBF',
    '#F5B7B1',
    '#AED6F1',
    '#F9E79F',
    '#ABEBC6',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Generate mock stats with randomization
export function generateMockStats(yourWord?: string): Stats {
  const total = getRandomCount(50, 500);
  const topWord = getRandomEmotion();

  // Generate top 10 with realistic distribution
  const top10: WordCount[] = [];
  for (let i = 0; i < 10; i++) {
    const word = i === 0 ? topWord : getRandomEmotion();
    // Ensure no duplicates in top 10
    if (!top10.find((item) => item.word === word)) {
      const maxCount =
        i === 0 ? Math.floor(total * 0.15) : Math.floor(total * 0.08);
      const minCount =
        i === 0 ? Math.floor(total * 0.08) : Math.floor(total * 0.02);
      const count = getRandomCount(minCount, maxCount);
      top10.push({ word, count });
    }
  }

  // Sort by count descending
  top10.sort((a, b) => b.count - a.count);

  // Generate your word stats if provided
  let yourWordStats: YourWordStats | undefined;
  if (yourWord) {
    const yourWordCount = getRandomCount(1, Math.floor(total * 0.05));
    const rank = getRandomCount(1, 20);
    const percentile = Math.max(1, Math.min(99, 100 - (rank / 20) * 100));

    yourWordStats = {
      word: yourWord,
      count: yourWordCount,
      rank,
      percentile,
    };
  }

  // Generate color palette
  const topPalette = [
    getRandomColorHex(),
    getRandomColorHex(),
    getRandomColorHex(),
    getRandomColorHex(),
    getRandomColorHex(),
  ];

  return {
    total,
    top: top10[0] || { word: 'peaceful', count: 1 },
    top5: top10.slice(0, 5),
    top10,
    yourWord: yourWordStats,
    colorHex: getEmotionColor(top10[0]?.word) || getRandomColorHex(),
    topPalette,
  };
}

// Generate mock emotion search results using the full emotion system
export function generateMockEmotions(query: string): string[] {
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
