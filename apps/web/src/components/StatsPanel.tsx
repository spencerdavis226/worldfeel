import type { Stats } from '@worldfeel/shared';
import { wordToColor } from '@worldfeel/shared';
import { useEffect, useState } from 'react';

interface StatsPanelProps {
  stats: Stats | null;
  loading: boolean;
  error: string | null;
}

function WordBadge({
  word,
  count,
  rank,
}: {
  word: string;
  count: number;
  rank?: number;
}) {
  const colors = wordToColor(word);

  return (
    <div className="flex items-center justify-between py-3 md:py-3.5 px-1">
      <div className="flex items-center space-x-3">
        <div className="text-[11px] font-medium text-gray-500 w-6">#{rank}</div>
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: colors.hex }}
        />
        <span className="text-[13px] font-medium text-gray-800">{word}</span>
      </div>
      <div className="text-[11px] text-gray-600">
        {count} {count === 1 ? 'person' : 'people'}
      </div>
    </div>
  );
}

export function StatsPanel({ stats, loading, error }: StatsPanelProps) {
  // Defer animations until after content is mounted to avoid pre-animation flash
  const [animateNow, setAnimateNow] = useState(false);
  // Only show skeleton if loading persists beyond a short threshold to avoid flicker
  const [showLoading, setShowLoading] = useState(false);
  useEffect(() => {
    if (loading) {
      const t = setTimeout(() => setShowLoading(true), 180);
      return () => clearTimeout(t);
    }
    setShowLoading(false);
  }, [loading]);
  useEffect(() => {
    if (!loading && !error && stats) {
      const id1 = requestAnimationFrame(() => {
        const id2 = requestAnimationFrame(() => setAnimateNow(true));
        (setAnimateNow as unknown as { __id2?: number }).__id2 = id2;
      });
      return () => {
        cancelAnimationFrame(id1);
        const anySet = setAnimateNow as unknown as { __id2?: number };
        if (anySet.__id2) cancelAnimationFrame(anySet.__id2);
      };
    }
    setAnimateNow(false);
    return;
  }, [loading, error, stats]);
  if (showLoading) {
    return (
      <div className="w-full max-w-xl mx-auto">
        {/* Main emotion loading - hero section */}
        <div className="mb-12 md:mb-16">
          <div className="text-center space-y-8">
            <h1 className="text-4xl sm:text-4xl md:text-5xl font-medium text-gray-800 leading-tight md:whitespace-nowrap">
              The world feels
            </h1>
            <div className="animate-pulse h-20 bg-gray-200/50 rounded w-48 mx-auto"></div>
          </div>
        </div>

        {/* Stats loading - secondary */}
        <div className="glass-panel p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200/50 rounded w-1/2 mx-auto mb-4"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200/50 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (loading) {
    return null;
  }

  if (error) {
    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
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

  const { top, top5 } = stats;

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Main emotion - hero section */}
      <div className="mb-12 md:mb-16">
        <div className="text-center space-y-6 md:space-y-8">
          <h1
            className={[
              'text-4xl sm:text-4xl md:text-5xl font-medium text-gray-800 leading-tight md:whitespace-nowrap',
              animateNow ? 'animate-fade-in-up anim-delay-0' : 'hidden',
            ].join(' ')}
          >
            The world feels
          </h1>
          <div
            className={[
              'text-6xl md:text-7xl font-medium',
              animateNow ? 'animate-fade-in-up anim-delay-900' : 'hidden',
            ].join(' ')}
            style={{ color: wordToColor(top.word).hex }}
          >
            {top.word}
          </div>
        </div>
      </div>

      {/* Top emotions list - secondary */}
      <div
        className={[
          'p-6 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg',
          animateNow ? 'animate-fade-in-up anim-delay-1600' : 'hidden',
        ].join(' ')}
      >
        <h3 className="text-sm font-medium text-gray-700 text-center mb-3 md:mb-4">
          Top feelings today
        </h3>
        <div className="space-y-1">
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
    </div>
  );
}
