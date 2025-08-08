import { Router, Request, Response } from 'express';
import {
  statsQuerySchema,
  wordToColor,
  generatePalette,
} from '@worldfeel/shared';
import { UnknownEmotion } from '../models/UnknownEmotion.js';
import type {
  Stats,
  StatsQuery,
  WordCount,
  YourWordStats,
} from '@worldfeel/shared';
import { Submission } from '../models/Submission.js';

const router = Router();

interface StatsRequest extends Request {
  query: {
    yourWord?: string;
  };
}

// Simple in-memory cache for stats results
interface CacheEntry {
  value: Stats;
  expiresAt: number;
}

const STATS_CACHE_TTL_MS = 5000; // 5 seconds
const statsCache = new Map<string, CacheEntry>();

function buildCacheKey(query: StatsQuery = {}): string {
  const parts = [query.yourWord || ''];
  return parts.join('|');
}

export function invalidateStatsCache(): void {
  statsCache.clear();
}

export async function getStats(query: StatsQuery = {}): Promise<Stats> {
  // Attempt to serve from cache
  const cacheKey = buildCacheKey(query);
  const cached = statsCache.get(cacheKey);
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  const { yourWord: yourWordQuery } = query;

  // Build match filter for location
  const matchFilter: any = {
    expiresAt: { $gt: new Date() }, // Only active submissions
  };

  // Main aggregation pipeline for word counts
  const pipeline: any[] = [
    { $match: matchFilter },
    {
      $group: {
        _id: '$word',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1, _id: 1 } },
    { $limit: 100 }, // Enough for ranking and UI
  ];

  const [wordCounts, totalResult] = await Promise.all([
    Submission.aggregate(pipeline),
    Submission.countDocuments(matchFilter),
  ]);

  // Process results
  const total = totalResult;
  const top5: WordCount[] = wordCounts.slice(0, 5).map((item) => ({
    word: item._id,
    count: item.count,
  }));

  const top: WordCount = top5[0] || { word: 'peaceful', count: 0 };

  // Handle your word stats
  let yourWord: YourWordStats | undefined;
  if (yourWordQuery) {
    const wordIndex = wordCounts.findIndex(
      (item) => item._id === yourWordQuery
    );
    if (wordIndex !== -1) {
      const wordData = wordCounts[wordIndex];
      const rank = wordIndex + 1;
      const percentile = Math.round(
        ((wordCounts.length - wordIndex) / wordCounts.length) * 100
      );

      yourWord = {
        word: wordData._id,
        count: wordData.count,
        rank,
        percentile,
      };
    } else {
      // Word not found in top 100, but might exist
      const wordCount = await Submission.countDocuments({
        ...matchFilter,
        word: yourWordQuery,
      });

      if (wordCount > 0) {
        // Get approximate rank by counting words with higher counts
        const higherCountsResult = await Submission.aggregate([
          { $match: matchFilter },
          { $group: { _id: '$word', count: { $sum: 1 } } },
          { $match: { count: { $gt: wordCount } } },
          { $count: 'higherWords' },
        ]);

        const higherWords = higherCountsResult[0]?.higherWords || 0;
        const rank = higherWords + 1;
        const percentile = Math.max(
          1,
          Math.round(((total - rank + 1) / total) * 100)
        );

        yourWord = {
          word: yourWordQuery,
          count: wordCount,
          rank,
          percentile,
        };
      }
    }
  }

  // Generate colors
  const topWord = yourWord?.word || top.word;
  const colors = wordToColor(topWord);
  if (!colors.matched) {
    try {
      await UnknownEmotion.updateOne(
        { word: topWord.toLowerCase().trim() },
        {
          $inc: { count: 1 },
          $set: { lastSeenAt: new Date() },
          $setOnInsert: { firstSeenAt: new Date() },
        },
        { upsert: true }
      );
    } catch (e) {
      console.warn('UnknownEmotion upsert failed (stats topWord):', e);
    }
  }
  const palette = generatePalette(colors.hex, 5);

  const result: Stats = {
    total,
    top,
    top5,
    colorHex: colors.hex,
    topPalette: palette,
  };

  if (yourWord) {
    result.yourWord = yourWord;
  }

  // Update cache
  statsCache.set(cacheKey, {
    value: result,
    expiresAt: now + STATS_CACHE_TTL_MS,
  });

  return result;
}

router.get('/', async (req: StatsRequest, res: Response): Promise<void> => {
  try {
    // Validate query parameters
    const validationResult = statsQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        message:
          validationResult.error.errors[0]?.message || 'Validation failed',
      });
      return;
    }

    const queryData = validationResult.data;
    const statsQuery: any = {};
    if (queryData.yourWord) statsQuery.yourWord = queryData.yourWord;

    const stats = await getStats(statsQuery);

    // Disable network caching to ensure users see fresh stats after submitting
    res.set('Cache-Control', 'no-store');

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Unable to fetch statistics',
    });
  }
});

export default router;
