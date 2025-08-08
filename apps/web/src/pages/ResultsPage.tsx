import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlassyBackground } from '../components/GlassyBackground';
import { StatsPanel } from '../components/StatsPanel';
import { useStats } from '../hooks/useStats';
import { useBackgroundColor } from '../hooks/useBackgroundColor';

export function ResultsPage() {
  const navigate = useNavigate();
  // Memoize the empty filters object to prevent recreations
  const emptyFilters = useMemo(() => ({}), []);

  // Get global stats (no filters for MVP)
  const { stats, loading, error } = useStats(emptyFilters, {
    autoRefresh: true,
    refreshInterval: 15000,
  });

  // Update background color based on top emotion
  useBackgroundColor(stats?.top?.word);

  // Hide the main content container until child animations are ready to avoid any flash
  const [showContainer, setShowContainer] = useState(false);
  useEffect(() => {
    // Show container only after stats have loaded or errored to avoid empty shell flash
    if (!loading) {
      const id = requestAnimationFrame(() => setShowContainer(true));
      return () => cancelAnimationFrame(id);
    }
    setShowContainer(false);
  }, [loading]);

  return (
    <GlassyBackground colorHex={stats?.colorHex}>
      <div
        className={[
          'min-h-screen flex flex-col items-center justify-between p-4',
          showContainer ? '' : 'invisible',
        ].join(' ')}
      >
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
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
            <Link
              to="/about"
              className="hover:text-gray-600 transition-colors underline py-2"
            >
              About
            </Link>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                // Prefer view transition when going back to home
                // @ts-ignore
                if (document && (document as any).startViewTransition) {
                  // @ts-ignore
                  (document as any).startViewTransition(() => navigate('/'));
                } else {
                  navigate('/');
                }
              }}
              className="hover:text-gray-600 transition-colors underline py-2"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </GlassyBackground>
  );
}
