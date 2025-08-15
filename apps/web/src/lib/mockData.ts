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

// Generate mock stats for results page fallback
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
    getEmotionColor(getRandomEmotion()) || '#6DCFF6',
    getEmotionColor(getRandomEmotion()) || '#4ECDC4',
    getEmotionColor(getRandomEmotion()) || '#45B7D1',
    getEmotionColor(getRandomEmotion()) || '#96CEB4',
    getEmotionColor(getRandomEmotion()) || '#FFEAA7',
  ];

  return {
    total,
    top: top10[0] || { word: 'peaceful', count: 1 },
    top5: top10.slice(0, 5),
    top10,
    yourWord: yourWordStats,
    colorHex: getEmotionColor(top10[0]?.word) || '#6DCFF6',
    topPalette,
  };
}
