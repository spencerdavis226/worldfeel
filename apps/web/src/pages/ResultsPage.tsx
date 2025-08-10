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

  // Mount-only entrance sequencing
  const [showContainer, setShowContainer] = useState(false);
  const [isFirstMount, setIsFirstMount] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [topHexCopied, setTopHexCopied] = useState(false);
  const topHexCopyTimerRef = useRef<number | null>(null);
  // Keep content visible during auto-refresh; only hide before first load completes
  const hasShownOnceRef = useRef(false);
  const prevTopWordRef = useRef<string | undefined>(undefined);
  const prevLoadingRef = useRef<boolean>(true);

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
    // On initial fetch completion, reveal container and mark first mount sequence
    if (!loading) {
      const id = requestAnimationFrame(() => {
        setShowContainer(true);
        if (isFirstMount) {
          // Ensure entrance sequence (including footer: 3600ms delay + 1200ms) completes
          setTimeout(() => setIsFirstMount(false), 5000);
        }
        hasShownOnceRef.current = true;
      });
      return () => cancelAnimationFrame(id);
    }
    if (!hasShownOnceRef.current) {
      setShowContainer(false);
    }
  }, [loading, isFirstMount]);

  // Detect soft auto-refresh updates to trigger quick fades without movement
  useEffect(() => {
    const currentTopWord = stats?.top?.word;
    if (!hasShownOnceRef.current) {
      prevTopWordRef.current = currentTopWord;
      return;
    }
    if (currentTopWord !== prevTopWordRef.current) {
      setIsRefreshing(true);
      // Keep the soft fade very short and subtle
      const t = window.setTimeout(() => setIsRefreshing(false), 400);
      return () => window.clearTimeout(t);
    }
    prevTopWordRef.current = currentTopWord;
  }, [stats?.top?.word, stats?.total]);

  // Also trigger a brief soft fade when each auto-refresh completes
  useEffect(() => {
    const wasLoading = prevLoadingRef.current;
    prevLoadingRef.current = loading;
    if (hasShownOnceRef.current && wasLoading && !loading) {
      setIsRefreshing(true);
      const t = window.setTimeout(() => setIsRefreshing(false), 300);
      return () => window.clearTimeout(t);
    }
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
        <div
          className={[
            'w-full max-w-xl mx-auto text-center px-4 sm:px-2',
            isFirstMount ? 'animate-seq-container' : '',
          ].join(' ')}
        >
          <StatsPanel
            stats={stats}
            loading={loading}
            error={error}
            isFirstMount={isFirstMount}
            isRefreshing={isRefreshing}
          />
          {/* Show message when no entries exist */}
          {!loading && stats?.top?.word === 'silent' && (
            <div className="text-center space-y-4 md:space-y-6">
              <h1 className="font-medium text-gray-800 leading-tight md:whitespace-nowrap tracking-[-0.01em] text-[clamp(1.5rem,2.2vw,3rem)]">
                The world feels
              </h1>
              <div className="font-semibold tracking-[-0.015em] leading-none text-gray-400 text-[clamp(3rem,8vw,7rem)]">
                silent
              </div>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                No one has shared their feelings yet today. Be the first to
                break the silence.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => navigate('/')}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg px-8 py-3 text-lg font-medium text-gray-800 hover:bg-white/30 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  Share Your Feelings
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer - bottom of viewport */}
        <div
          className={[
            'w-full text-center pb-6 px-4',
            isFirstMount ? 'animate-footer-fade-in anim-delay-footer' : '',
            isRefreshing ? 'animate-soft-fade-in' : '',
          ].join(' ')}
        >
          {stats?.colorHex && stats?.top?.word !== 'silent' ? (
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
            {stats?.top?.word === 'silent'
              ? 'No feelings shared yet today'
              : `${stats?.total?.toLocaleString() || '0'} ${(stats?.total || 0) === 1 ? 'feeling' : 'feelings'} shared today`}
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
