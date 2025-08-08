import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { GlassyBackground } from '../components/GlassyBackground';
import { StatsPanel } from '../components/StatsPanel';
import { useStats } from '../hooks/useStats';
import { useBackgroundColor } from '../hooks/useBackgroundColor';
import { wordToColor } from '@worldfeel/shared';

export function ResultsPage() {
  // Memoize the empty filters object to prevent recreations
  const emptyFilters = useMemo(() => ({}), []);

  // Get global stats (no filters for MVP)
  const { stats, loading, error } = useStats(emptyFilters, {
    autoRefresh: false,
  });

  // Update background color based on top emotion
  useBackgroundColor(stats?.top?.word);

  return (
    <GlassyBackground colorHex={stats?.colorHex}>
      <div className="min-h-screen flex flex-col items-center justify-between p-4">
        {/* Top spacer */}
        <div></div>

        {/* Main content - centered */}
        <div className="w-full max-w-xl mx-auto text-center px-4 sm:px-2">
          <StatsPanel stats={stats} loading={loading} error={error} />
        </div>

        {/* Footer - bottom of viewport */}
        <div className="w-full text-center space-y-3 pb-6 px-4">
          <p className="text-sm text-gray-500">
            {stats?.total?.toLocaleString() || '0'} feelings shared today
          </p>
          {/* Color information */}
          {stats?.top && (
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
              <span>Today's emotional color</span>
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: wordToColor(stats.top.word).hex }}
              />
              <span className="font-mono tracking-wider">
                {wordToColor(stats.top.word).hex.toUpperCase()}
              </span>
              <span className="text-gray-500">
                - {(wordToColor(stats.top.word) as any).name ?? 'Custom'}
              </span>
            </div>
          )}
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
            <Link
              to="/about"
              className="hover:text-gray-600 transition-colors underline py-2"
            >
              About
            </Link>
            <span>•</span>
            <Link
              to="/"
              className="hover:text-gray-600 transition-colors underline py-2"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </GlassyBackground>
  );
}
