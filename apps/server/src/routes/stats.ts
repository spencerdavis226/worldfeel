import { Router, Request, Response } from 'express';
import { statsQuerySchema, getEmotionColor } from '@worldfeel/shared';
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
    deviceId?: string;
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
  // Include deviceId so per-device "yourWord" is not mixed in cache
  const parts = [query.yourWord || '', (query as any).deviceId || ''];
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

  let { yourWord: yourWordQuery } = query;
  const deviceId = (query as any).deviceId as string | undefined;

  // Build match filter for location
  const matchFilter: { yourWord?: string; expiresAt?: { $gt: Date } } = {
    expiresAt: { $gt: new Date() }, // Only active submissions
  };

  // Main aggregation pipeline for word counts
  const pipeline: any[] = [
    { $match: matchFilter },
    {
      $group: {
        _id: '$word',
        count: { $sum: 1 },
        // Track most recent submission time per word for tie-breaking
        lastCreatedAt: { $max: '$createdAt' },
      },
    },
    // Sort by count desc, then most recent createdAt desc, then alphabetical as final stable tiebreaker
    { $sort: { count: -1, lastCreatedAt: -1, _id: 1 } },
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
  const top10: WordCount[] = wordCounts.slice(0, 10).map((item) => ({
    word: item._id,
    count: item.count,
  }));

  // If no entries, use "silent" to represent the quiet state
  const top: WordCount = top5[0] || { word: 'silent', count: 0 };

  // If deviceId provided, find most recent submission for that device to determine yourWord
  if (!yourWordQuery && deviceId) {
    const latest = await Submission.findOne({
      ...matchFilter,
      deviceId,
    })
      .sort({ createdAt: -1 })
      .lean();
    if (latest && latest.word) {
      yourWordQuery = latest.word;
    }
  }

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

  // Generate colors: background should match the hero (top word), not personal
  const hex = getEmotionColor(top.word) || '#6DCFF6';
  const palette = [hex];

  const result: Stats = {
    total,
    top,
    top5,
    top10,
    colorHex: hex,
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
    const statsQuery: Record<string, unknown> = {};
    if (queryData.yourWord) statsQuery.yourWord = queryData.yourWord;
    if ((queryData as any).deviceId)
      statsQuery.deviceId = (queryData as any).deviceId;

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
