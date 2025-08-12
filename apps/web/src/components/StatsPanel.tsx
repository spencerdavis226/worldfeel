import type { Stats } from '@worldfeel/shared';
import { getEmotionColor } from '@worldfeel/shared/emotion-color-map';
import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { AnimatedValue } from '@components/AnimatedValue';
import {
  getReadableTextColorSync,
  getTextShadowForContrastSync,
} from '@lib/colorContrastLazy';
import { timeFunction } from '@lib/performance';

interface StatsPanelProps {
  stats: Stats | null;
  error: string | null;
  loading?: boolean;
  isFirstMount?: boolean;
}

function formatPercent(count: number, total: number): string {
  if (!Number.isFinite(total) || total <= 0) return '0%';
  if (!Number.isFinite(count) || count <= 0) return '0%';
  const pct = (count / total) * 100;
  if (pct > 0 && pct < 1) return '<1%';
  return `${Math.round(pct)}%`;
}

// Removed WordBadge in favor of inline rows with fine-grained AnimatedValue transitions

export const StatsPanel = memo(function StatsPanel({
  stats,
  error,
  isFirstMount = false,
}: StatsPanelProps) {
  // Hide the stats panel if the word is "silent" (no entries in database)
  if (stats?.top?.word === 'silent') {
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

  const [hexCopied, setHexCopied] = useState(false);
  const hexCopyTimerRef = useRef<number | null>(null);

  // Dynamically compact the "You feel" label to "You:" only if the text would clip
  const youTextRef = useRef<HTMLSpanElement | null>(null);
  const [compactYouLabel, setCompactYouLabel] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      const el = youTextRef.current;
      if (!el) return;
      // If the rendered text exceeds available width, enable compact label
      setCompactYouLabel(el.scrollWidth > el.clientWidth + 1);
    };
    const id = requestAnimationFrame(checkOverflow);
    window.addEventListener('resize', checkOverflow);
    return () => {
      window.removeEventListener('resize', checkOverflow);
      cancelAnimationFrame(id);
    };
  }, [stats?.yourWord?.word]);

  const handleCopyHex = useCallback(async (): Promise<void> => {
    if (!stats?.yourWord) return;
    const yourHex = getEmotionColor(stats.yourWord.word) || '#6DCFF6';
    const value = (yourHex || '').toUpperCase();
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
      setHexCopied(true);
      if (hexCopyTimerRef.current) window.clearTimeout(hexCopyTimerRef.current);
      hexCopyTimerRef.current = window.setTimeout(
        () => setHexCopied(false),
        1200
      );
    } catch {
      // noop
    }
  }, [stats?.yourWord]);

  useEffect(() => {
    return () => {
      if (hexCopyTimerRef.current) window.clearTimeout(hexCopyTimerRef.current);
    };
  }, []);

  const your = stats?.yourWord;
  const total = stats?.total || 0;
  const yourPercentText = your ? formatPercent(your.count, total) : undefined;
  const yourHex = your ? getEmotionColor(your.word) || '#6DCFF6' : undefined;
  const top10 = stats?.top10 ?? stats?.top5 ?? [];

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Main emotion - hero section */}
      <div
        className={`mb-10 md:mb-20 lg:mb-28 ${isFirstMount ? 'wf-enter wf-hero wf-d0' : ''}`}
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
              value={stats?.top?.word || '\u00A0'}
              fadeOutMs={200}
              fadeInMs={300}
              animateInitial={false}
              variant="fade"
              render={(val) => (
                <span
                  style={(() => {
                    const originalColor =
                      getEmotionColor(stats?.top?.word || '') || '#6DCFF6';
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
                      10 // Log if takes longer than 10ms
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

      {/* Your contribution chip (centered, glassy) */}
      <div
        className={`mt-1.5 mb-4 ${isFirstMount ? 'wf-enter wf-chip wf-d1' : ''}`}
      >
        <div className="w-full flex justify-center px-0">
          {your ? (
            <div className="w-full">
              <div
                className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg px-5 md:px-7 py-3 md:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 min-w-0"
                aria-label={`You feel ${your.word}. ${yourPercentText} match. Color ${yourHex}`}
              >
                <div className="w-full flex items-center justify-center sm:justify-between gap-2 sm:gap-3 min-w-0">
                  {/* Left cluster: label + divider + percent (single line) */}
                  <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 min-w-0 sm:flex-1">
                    <span
                      ref={youTextRef}
                      className="text-sm text-gray-800 truncate min-w-0 text-center sm:text-left"
                    >
                      {compactYouLabel ? 'You: ' : 'You feel '}
                      <AnimatedValue
                        className="font-bold text-gray-900"
                        value={your.word}
                        fadeOutMs={160}
                        fadeInMs={240}
                      />
                    </span>
                    <span className="h-4 w-px bg-white/50" />
                    <span className="text-sm text-gray-800 tabular-nums whitespace-nowrap">
                      <AnimatedValue
                        value={yourPercentText || ''}
                        fadeOutMs={160}
                        fadeInMs={240}
                      />{' '}
                      match
                    </span>
                  </div>
                  {/* HEX token on desktop/tablet (right side) */}
                  <button
                    type="button"
                    onClick={handleCopyHex}
                    title="Copy HEX"
                    className="hidden sm:inline-flex glass-token items-center h-7 px-2 gap-1.5 text-[10px] font-mono tracking-normal text-gray-700 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 whitespace-nowrap"
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-[3px]"
                      style={{ backgroundColor: yourHex }}
                      aria-hidden
                    />
                    <span
                      className="inline-block w-[8ch] text-left leading-none"
                      aria-live="polite"
                    >
                      {hexCopied ? (
                        'COPIED'
                      ) : (
                        <AnimatedValue
                          value={(yourHex || '').toUpperCase()}
                          fadeOutMs={120}
                          fadeInMs={200}
                        />
                      )}
                    </span>
                  </button>
                </div>
                {/* HEX token on mobile (second row) */}
                <div className="mt-1 sm:hidden w-full flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleCopyHex}
                    title="Copy HEX"
                    className="glass-token inline-flex items-center h-7 px-2 gap-1.5 text-[10px] font-mono tracking-normal text-gray-700 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 whitespace-nowrap"
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-[3px]"
                      style={{ backgroundColor: yourHex }}
                      aria-hidden
                    />
                    <span
                      className="inline-block w-[8ch] text-left leading-none"
                      aria-live="polite"
                    >
                      {hexCopied ? (
                        'COPIED'
                      ) : (
                        <AnimatedValue
                          value={(yourHex || '').toUpperCase()}
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
            <div className="w-full sm:w-full md:max-w-md lg:max-w-md bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg px-4 py-3 text-sm text-gray-700 text-center">
              Share one word to see your color today.
            </div>
          )}
        </div>
      </div>

      {/* Top emotions list - snapshot only (top 3), no scroll, no expansion */}
      {top10.length > 0 && (
        <div
          className={`px-5 py-4 md:px-6 md:py-5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg mb-4 ${isFirstMount ? 'wf-enter wf-stats wf-d2' : ''}`}
        >
          <div className="space-y-1.5">
            {top10.slice(0, 3).map((item, index) => (
              <div
                key={`rank-${index}`}
                className="flex items-center justify-between py-2 md:py-2.5 px-1"
              >
                <div className="grid grid-cols-[max-content,0.75rem,1fr] items-center gap-x-3 min-w-0">
                  <div className="text-[11px] font-medium text-gray-500 tabular-nums text-left">
                    #{index + 1}
                  </div>
                  <AnimatedValue
                    value={item.word}
                    animateInitial={false}
                    fadeOutMs={160}
                    fadeInMs={260}
                    render={(word) => (
                      <div
                        className="w-3 h-3 rounded-full justify-self-center"
                        style={{
                          backgroundColor:
                            getEmotionColor(String(word)) || '#6DCFF6',
                        }}
                      />
                    )}
                  />
                  <span className="text-[13px] font-medium text-gray-800 truncate">
                    <AnimatedValue
                      value={item.word}
                      animateInitial={false}
                      fadeOutMs={180}
                      fadeInMs={280}
                    />
                  </span>
                </div>
                <div className="text-[11px] text-gray-700 tabular-nums w-12 text-right">
                  <AnimatedValue
                    value={formatPercent(item.count, total)}
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
  );
});
