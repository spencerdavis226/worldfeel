import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { GlassyBackground } from '../components/GlassyBackground';
import { StatsPanel } from '../components/StatsPanel';
import { ColorBadge } from '../components/ColorBadge';
import { useStats } from '../hooks/useStats';
import { useBackgroundColor } from '../hooks/useBackgroundColor';

export function ResultsPage() {
  // Memoize the empty filters object to prevent recreations
  const emptyFilters = useMemo(() => ({}), []);

  // Get global stats (no filters for MVP)
  const { stats, loading, error } = useStats(emptyFilters, {
    autoRefresh: true,
    refreshInterval: 5000, // Refresh every 5 seconds
  });

  // Update background color based on top emotion
  useBackgroundColor(stats?.top?.word);

  return (
    <GlassyBackground colorHex={stats?.colorHex}>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-light text-gray-800">
            The world is feeling
          </h1>
        </div>

        {/* Stats Display */}
        <div className="w-full max-w-lg">
          <StatsPanel stats={stats} loading={loading} error={error} />
        </div>

        {/* Actions */}
        <div className="space-y-4 text-center">
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-xl text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          >
            Share again tomorrow
          </Link>

          <p className="text-sm text-gray-500">
            You can update your word for the next 5 minutes
          </p>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2 pt-8">
          <p className="text-sm text-gray-500">
            {stats?.total?.toLocaleString() || '0'} feelings shared today
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
            <Link
              to="/about"
              className="hover:text-gray-600 transition-colors underline"
            >
              About
            </Link>
            <span>•</span>
            <Link
              to="/"
              className="hover:text-gray-600 transition-colors underline"
            >
              Home
            </Link>
          </div>
        </div>

        {/* Color badge */}
        <ColorBadge word={stats?.top?.word} colorHex={stats?.colorHex} />
      </div>
    </GlassyBackground>
  );
}
