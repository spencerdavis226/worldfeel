import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UniversalBackground } from '@components/UniversalBackground';
import { AnimatedValue } from '@components/AnimatedValue';

import { useStats } from '@hooks/useStats';
import { usePageTitle } from '@hooks/usePageTitle';
import { getEmotionColor } from '@worldfeel/shared/emotion-color-map';
import { apiClient } from '@lib/apiClient';
import {
  getReadableTextColorSync,
  getTextShadowForContrastSync,
} from '@lib/colorContrastLazy';
import { timeFunction } from '@lib/performance';

function formatPercent(count: number, total: number): string {
  if (!Number.isFinite(total) || total <= 0) return '0%';
  if (!Number.isFinite(count) || count <= 0) return '0%';
  const pct = (count / total) * 100;
  if (pct > 0 && pct < 1) return '<1%';
  return `${Math.round(pct)}%`;
}

export function ResultsPage() {
  usePageTitle('Results');

  const navigate = useNavigate();
  const [showContainer, setShowContainer] = useState(false);
  const [isFirstMount, setIsFirstMount] = useState(true);
  const [yourHexCopied, setYourHexCopied] = useState(false);
  const [topHexCopied, setTopHexCopied] = useState(false);
  const yourHexCopyTimerRef = useRef<number | null>(null);
  const topHexCopyTimerRef = useRef<number | null>(null);
  const hasShownOnceRef = useRef(false);

  // Get user's word and device ID - read from localStorage on mount and when server comes back online
  const [yourWord, setYourWord] = useState<string | undefined>(() => {
    try {
      return localStorage.getItem('wf.yourWord') || undefined;
    } catch {
      return undefined;
    }
  });

  // Update yourWord when pending submissions are processed (server comes back online)
  useEffect(() => {
    const handlePendingSubmissionsProcessed = () => {
      try {
        const newWord = localStorage.getItem('wf.yourWord') || undefined;
        setYourWord(newWord);
      } catch {
        // Ignore localStorage errors
      }
    };

    apiClient.setOnPendingSubmissionsProcessed(
      handlePendingSubmissionsProcessed
    );

    return () => {
      apiClient.setOnPendingSubmissionsProcessed(() => {});
    };
  }, []);

  const { stats, loading, error } = useStats(
    { ...(yourWord ? { yourWord } : {}) },
    {
      autoRefresh: true,
      refreshInterval: 15000,
    }
  );

  // Check if we have valid stats data (either real or fallback)
  // Only show empty state if we have no stats and there's a real error
  const isEmpty = !loading && !stats && error;

  // Add a timeout for loading state to prevent indefinite hanging
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        setLoadingTimeout(true);
      }, 8000); // 8 second timeout for loading

      return () => clearTimeout(timeout);
    } else {
      setLoadingTimeout(false);
    }
  }, [loading]);

  // Copy handlers
  async function handleCopyYourHex(): Promise<void> {
    const value = stats?.yourWord?.word
      ? (getEmotionColor(stats.yourWord.word) || '#6DCFF6').toUpperCase()
      : '';
    if (!value) return;

    try {
      await navigator.clipboard?.writeText(value);
      setYourHexCopied(true);
      if (yourHexCopyTimerRef.current)
        window.clearTimeout(yourHexCopyTimerRef.current);
      yourHexCopyTimerRef.current = window.setTimeout(
        () => setYourHexCopied(false),
        1200
      );
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setYourHexCopied(true);
      if (yourHexCopyTimerRef.current)
        window.clearTimeout(yourHexCopyTimerRef.current);
      yourHexCopyTimerRef.current = window.setTimeout(
        () => setYourHexCopied(false),
        1200
      );
    }
  }

  async function handleCopyTopHex(): Promise<void> {
    const value = (stats?.colorHex || '').toUpperCase();
    if (!value) return;

    try {
      await navigator.clipboard?.writeText(value);
      setTopHexCopied(true);
      if (topHexCopyTimerRef.current)
        window.clearTimeout(topHexCopyTimerRef.current);
      topHexCopyTimerRef.current = window.setTimeout(
        () => setTopHexCopied(false),
        1200
      );
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setTopHexCopied(true);
      if (topHexCopyTimerRef.current)
        window.clearTimeout(topHexCopyTimerRef.current);
      topHexCopyTimerRef.current = window.setTimeout(
        () => setTopHexCopied(false),
        1200
      );
    }
  }

  // Animation effects
  useEffect(() => {
    if (!loading) {
      const id = requestAnimationFrame(() => {
        setShowContainer(true);
        if (isFirstMount) {
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

  useEffect(() => {
    return () => {
      if (yourHexCopyTimerRef.current)
        window.clearTimeout(yourHexCopyTimerRef.current);
      if (topHexCopyTimerRef.current)
        window.clearTimeout(topHexCopyTimerRef.current);
    };
  }, []);

  return (
    <UniversalBackground
      centerColorHex={stats?.colorHex}
      edgeColorHex={
        stats?.yourWord?.word ? getEmotionColor(stats.yourWord.word) : undefined
      }
    >
      <div
        className={[
          'min-h-[100vh] min-h-[100svh] min-h-[100dvh] flex flex-col items-center justify-center p-4 ios-layout-fix',
          showContainer ? '' : 'invisible',
        ].join(' ')}
      >
        <div
          className={[
            'w-full max-w-4xl mx-auto text-center px-4 sm:px-6 flex flex-col justify-center',
            isFirstMount && showContainer ? 'animate-seq-container' : '',
          ].join(' ')}
          style={{
            minHeight: 'calc(100vh - 4rem)',
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {/* Main hero section */}
          <div
            className={`mb-8 sm:mb-12 md:mb-16 lg:mb-20 ${isFirstMount && showContainer ? 'wf-enter wf-hero wf-d0' : ''}`}
            aria-live="polite"
          >
            <div className="text-center space-y-4 md:space-y-6">
              <h1 className="font-medium text-gray-800 leading-tight md:whitespace-nowrap tracking-[-0.01em] text-[clamp(1.5rem,2.2vw,3rem)]">
                The world feels
              </h1>
              <div
                className="relative mx-auto inline-block"
                style={{ minHeight: '1em' }}
              >
                <AnimatedValue
                  className="block font-semibold tracking-[-0.015em] leading-none text-[clamp(3rem,8vw,7rem)]"
                  value={stats?.top?.word || (isEmpty ? 'silent' : '\u00A0')}
                  fadeOutMs={200}
                  fadeInMs={300}
                  animateInitial={false}
                  variant="fade"
                  render={(val) => (
                    <span
                      style={(() => {
                        const originalColor =
                          getEmotionColor(
                            stats?.top?.word || (isEmpty ? 'silent' : '')
                          ) || '#6DCFF6';
                        return timeFunction(
                          'color-contrast-calculation',
                          () => ({
                            color: getReadableTextColorSync(originalColor, {
                              backgroundColor: 'rgba(255, 255, 255, 0.85)',
                              isLargeText: true,
                              preserveVibrancy: true,
                              maxDarkening: 0.5,
                            }),
                            textShadow: getTextShadowForContrastSync(
                              originalColor,
                              'subtle'
                            ),
                          }),
                          10
                        );
                      })()}
                    >
                      {val as string}
                    </span>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Empty state message - only show if we have no stats and a real error */}
          {isEmpty && (
            <div className="text-center space-y-4 md:space-y-6 mb-8">
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                Unable to connect to the server. Please check your connection
                and try again.
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

          {/* Loading timeout message */}
          {loadingTimeout && loading && (
            <div className="text-center space-y-4 md:space-y-6 mb-8">
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                Taking longer than usual to connect. The server might be
                starting up.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg px-8 py-3 text-lg font-medium text-gray-800 hover:bg-white/30 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Results Panel - Show when we have stats (real or fallback) */}
          {stats && !isEmpty && (
            <div className="space-y-4 max-w-3xl mx-auto w-full">
              {/* Your contribution chip */}
              <div
                className={`w-full ${isFirstMount && showContainer ? 'wf-enter wf-chip wf-d1' : ''}`}
              >
                {stats.yourWord ? (
                  <div
                    className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg px-6 py-4"
                    aria-label={`You feel ${stats.yourWord.word}. ${formatPercent(stats.yourWord.count, stats.total || 0)} match. Color ${getEmotionColor(stats.yourWord.word) || '#6DCFF6'}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center justify-center sm:justify-start gap-3">
                        <span className="text-sm text-gray-800">
                          You feel{' '}
                          <AnimatedValue
                            className="font-bold text-gray-900"
                            value={stats.yourWord.word}
                            fadeOutMs={160}
                            fadeInMs={240}
                          />
                        </span>
                        <span className="h-4 w-px bg-white/50" />
                        <span className="text-sm text-gray-800 tabular-nums whitespace-nowrap">
                          <AnimatedValue
                            value={formatPercent(
                              stats.yourWord.count,
                              stats.total || 0
                            )}
                            fadeOutMs={160}
                            fadeInMs={240}
                          />{' '}
                          match
                        </span>
                      </div>
                      <div className="flex justify-center sm:justify-end">
                        <button
                          type="button"
                          onClick={handleCopyYourHex}
                          title="Copy HEX"
                          className="glass-token inline-flex items-center h-8 px-3 gap-2 text-xs font-mono tracking-normal text-gray-700 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 whitespace-nowrap hover:bg-white/10 transition-colors"
                        >
                          <span
                            className="inline-block w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                getEmotionColor(stats.yourWord.word) ||
                                '#6DCFF6',
                            }}
                            aria-hidden
                          />
                          <span
                            className="inline-block w-[8ch] text-left leading-none"
                            aria-live="polite"
                          >
                            {yourHexCopied ? (
                              'COPIED'
                            ) : (
                              <AnimatedValue
                                value={(
                                  getEmotionColor(stats.yourWord.word) ||
                                  '#6DCFF6'
                                ).toUpperCase()}
                                fadeOutMs={120}
                                fadeInMs={200}
                              />
                            )}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg px-6 py-4 text-sm text-gray-700 text-center">
                    Share one word to see your color today.
                  </div>
                )}
              </div>

              {/* Top emotions stats chip */}
              {stats.top10 && stats.top10.length > 0 && (
                <div
                  className={`w-full px-6 py-5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg ${isFirstMount && showContainer ? 'wf-enter wf-stats wf-d2' : ''}`}
                >
                  <div className="space-y-2">
                    {stats.top10.slice(0, 3).map((item, index) => (
                      <div
                        key={`rank-${index}`}
                        className="flex items-center justify-between py-2.5 px-1"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="text-xs font-medium text-gray-500 tabular-nums w-8 text-left">
                            #{index + 1}
                          </div>
                          <AnimatedValue
                            value={item.word}
                            animateInitial={false}
                            fadeOutMs={160}
                            fadeInMs={260}
                            render={(word) => (
                              <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{
                                  backgroundColor:
                                    getEmotionColor(String(word)) || '#6DCFF6',
                                }}
                              />
                            )}
                          />
                          <span className="text-sm font-medium text-gray-800 truncate">
                            <AnimatedValue
                              value={item.word}
                              animateInitial={false}
                              fadeOutMs={180}
                              fadeInMs={280}
                            />
                          </span>
                        </div>
                        <div className="text-xs text-gray-700 tabular-nums w-12 text-right flex-shrink-0">
                          <AnimatedValue
                            value={formatPercent(item.count, stats.total || 0)}
                            animateInitial={false}
                            fadeOutMs={160}
                            fadeInMs={260}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div
            className={`mt-8 md:mt-12 space-y-4 ${isFirstMount && showContainer ? 'wf-enter wf-footer wf-d3' : ''}`}
          >
            {stats?.colorHex && !isEmpty ? (
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleCopyTopHex}
                  title="Copy top color HEX"
                  className="glass-token inline-flex items-center h-8 px-3 gap-2 text-xs font-mono tracking-normal text-gray-700 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 hover:text-gray-800 transition-colors"
                  aria-label={`Top color ${topHexCopied ? 'copied' : (stats.colorHex || '').toUpperCase()}`}
                >
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: stats.colorHex }}
                    aria-hidden
                  />
                  <span
                    className="inline-block w-[8ch] text-left leading-none"
                    aria-live="polite"
                  >
                    {topHexCopied ? (
                      'COPIED'
                    ) : (
                      <AnimatedValue
                        value={(stats.colorHex || '').toUpperCase()}
                        fadeOutMs={140}
                        fadeInMs={220}
                      />
                    )}
                  </span>
                </button>
              </div>
            ) : null}
            <p className="text-sm text-gray-500 text-center">
              {isEmpty ? (
                'Connection error'
              ) : stats ? (
                <>
                  <AnimatedValue
                    value={(stats.total ?? 0).toLocaleString()}
                    fadeOutMs={160}
                    fadeInMs={240}
                  />{' '}
                  <AnimatedValue
                    value={(stats.total || 0) === 1 ? 'feeling' : 'feelings'}
                    fadeOutMs={120}
                    fadeInMs={200}
                  />{' '}
                  shared today
                </>
              ) : (
                'Loading...'
              )}
            </p>
          </div>
        </div>
      </div>
    </UniversalBackground>
  );
}
