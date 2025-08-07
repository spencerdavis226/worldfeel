import React from 'react';
import type { Stats } from '@worldfeel/shared';
import { wordToColor } from '@worldfeel/shared';

interface StatsPanelProps {
  stats: Stats | null;
  loading: boolean;
  error: string | null;
}

function WordBadge({ word, count, rank }: { word: string; count: number; rank?: number }) {
  const colors = wordToColor(word);

  return (
    <div className="flex items-center justify-between p-3 glass-panel">
      <div className="flex items-center space-x-3">
        {rank && (
          <div className="text-sm font-bold text-gray-500 w-6">
            #{rank}
          </div>
        )}
        <div
          className="w-4 h-4 rounded-full border border-white/30"
          style={{ backgroundColor: colors.hex }}
        />
        <span className="font-medium text-gray-800">{word}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">{count}</span>
        <span className="text-xs text-gray-400">
          {count === 1 ? 'person' : 'people'}
        </span>
      </div>
    </div>
  );
}

function YourWordStats({ yourWord }: { yourWord: NonNullable<Stats['yourWord']> }) {
  const colors = wordToColor(yourWord.word);

  return (
    <div className="glass-card p-6 space-y-4">
      <h3 className="font-semibold text-gray-800 text-center">Your Feeling</h3>

      <div className="text-center space-y-2">
        <div
          className="inline-flex items-center space-x-3 px-4 py-2 rounded-full"
          style={{
            backgroundColor: `${colors.hex}20`,
            border: `1px solid ${colors.hex}40`
          }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: colors.hex }}
          />
          <span className="font-medium text-gray-800">"{yourWord.word}"</span>
        </div>

        <div className="text-sm text-gray-600">
          Shared by <span className="font-semibold">{yourWord.count}</span> {yourWord.count === 1 ? 'person' : 'people'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="glass-panel p-3">
          <div className="text-lg font-bold text-gray-800">#{yourWord.rank}</div>
          <div className="text-xs text-gray-500">Rank</div>
        </div>
        <div className="glass-panel p-3">
          <div className="text-lg font-bold text-gray-800">{yourWord.percentile}%</div>
          <div className="text-xs text-gray-500">Top Percentile</div>
        </div>
      </div>
    </div>
  );
}

export function StatsPanel({ stats, loading, error }: StatsPanelProps) {
  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="glass-card p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200/50 rounded w-3/4 mx-auto"></div>
            <div className="h-8 bg-gray-200/50 rounded w-1/2 mx-auto"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200/50 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="glass-card p-6 text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const { total, top, top5, yourWord } = stats;

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Global stats */}
      <div className="glass-card p-6 space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">
            Right now, the world feels
          </h2>
          <div className="text-3xl font-bold" style={{ color: wordToColor(top.word).hex }}>
            "{top.word}"
          </div>
          <p className="text-sm text-gray-600">
            {total.toLocaleString()} {total === 1 ? 'person has' : 'people have'} shared today
          </p>
        </div>
      </div>

      {/* Your word stats */}
      {yourWord && <YourWordStats yourWord={yourWord} />}

      {/* Top 5 emotions */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="font-semibold text-gray-800 text-center">
          Most Common Feelings
        </h3>
        <div className="space-y-2">
          {top5.map((item, index) => (
            <WordBadge
              key={item.word}
              word={item.word}
              count={item.count}
              rank={index + 1}
            />
          ))}
        </div>
      </div>

      {/* Last updated */}
      <div className="text-center text-xs text-gray-400">
        Updates every 10 seconds • Data expires after 24 hours
      </div>
    </div>
  );
}
