import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlassyBackground } from '../components/GlassyBackground';
import { getDeviceId } from '../utils/device';
import { StatsPanel } from '../components/StatsPanel';
import { useStats } from '../hooks/useStats';
import { useBackgroundColor } from '../hooks/useBackgroundColor';

export function ResultsPage() {
  const navigate = useNavigate();
  // Memoize the empty filters object to prevent recreations (removed; we build filters dynamically)

  // Get global stats (no filters for MVP)
  // Load your word from local storage if available
  const yourWord = useMemo(() => {
    try {
      return localStorage.getItem('wf.yourWord') || undefined;
    } catch {
      return undefined;
    }
  }, []);

  const deviceId = useMemo(() => {
    try {
      return getDeviceId();
    } catch {
      return undefined as unknown as string;
    }
  }, []);

  const { stats, loading, error } = useStats(
    { ...(yourWord ? { yourWord } : {}), ...(deviceId ? { deviceId } : {}) },
    {
      autoRefresh: true,
      refreshInterval: 15000,
    }
  );

  // Update background color: center = top emotion, edges = personal (if any)
  useBackgroundColor(stats?.top?.word, stats?.yourWord?.word);

  // Hide the main content container until child animations are ready to avoid any flash
  const [showContainer, setShowContainer] = useState(false);
  const [topHexCopied, setTopHexCopied] = useState(false);
  const topHexCopyTimerRef = useRef<number | null>(null);

  async function handleCopyTopHex(): Promise<void> {
    const value = (stats?.colorHex || '').toUpperCase();
    if (!value) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setTopHexCopied(true);
      if (topHexCopyTimerRef.current)
        window.clearTimeout(topHexCopyTimerRef.current);
      topHexCopyTimerRef.current = window.setTimeout(
        () => setTopHexCopied(false),
        1200
      );
    } catch {
      // noop
    }
  }
  useEffect(() => {
    // Show container only after stats have loaded or errored to avoid empty shell flash
    if (!loading) {
      const id = requestAnimationFrame(() => setShowContainer(true));
      return () => cancelAnimationFrame(id);
    }
    setShowContainer(false);
  }, [loading]);

  useEffect(() => {
    return () => {
      if (topHexCopyTimerRef.current)
        window.clearTimeout(topHexCopyTimerRef.current);
    };
  }, []);

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
        <div className="w-full text-center pb-6 px-4">
          {stats?.colorHex ? (
            <div className="flex items-center justify-center mb-4">
              <button
                type="button"
                onClick={handleCopyTopHex}
                title="Copy top color HEX"
                className="glass-token inline-flex items-center h-7 px-2 gap-1.5 text-[10px] font-mono tracking-normal text-gray-700 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 hover:text-gray-800 transition-colors"
                aria-label={`Top color ${topHexCopied ? 'copied' : (stats.colorHex || '').toUpperCase()}`}
              >
                <span
                  className="inline-block w-2 h-2 rounded-[3px]"
                  style={{ backgroundColor: stats.colorHex }}
                  aria-hidden
                />
                <span
                  className="inline-block w-[8ch] text-left leading-none"
                  aria-live="polite"
                >
                  {topHexCopied
                    ? 'COPIED'
                    : (stats.colorHex || '').toUpperCase()}
                </span>
              </button>
            </div>
          ) : null}
          <p className="text-sm text-gray-500 mb-2">
            {stats?.total?.toLocaleString() || '0'} feelings shared today
          </p>
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
            <Link
              to="/about"
              className="hover:text-gray-600 transition-colors py-2 focus-visible-ring rounded"
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
              className="hover:text-gray-600 transition-colors py-2 focus-visible-ring rounded"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </GlassyBackground>
  );
}
