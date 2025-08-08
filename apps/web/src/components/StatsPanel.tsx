import type { Stats } from '@worldfeel/shared';
import { getEmotionColor } from '@worldfeel/shared/emotion-color-map';
import { useEffect, useRef, useState } from 'react';

interface StatsPanelProps {
  stats: Stats | null;
  loading: boolean;
  error: string | null;
}

function formatPercent(count: number, total: number): string {
  if (!Number.isFinite(total) || total <= 0) return '0%';
  if (!Number.isFinite(count) || count <= 0) return '0%';
  const pct = (count / total) * 100;
  if (pct > 0 && pct < 1) return '<1%';
  return `${Math.round(pct)}%`;
}

function WordBadge({
  word,
  count,
  total,
  rank,
}: {
  word: string;
  count: number;
  total: number;
  rank?: number;
}) {
  const hex = getEmotionColor(word) || '#6DCFF6';
  const percentText = formatPercent(count, total);

  return (
    <div className="flex items-center justify-between py-2 md:py-2.5 px-1">
      <div className="grid grid-cols-[max-content,0.75rem,1fr] items-center gap-x-3 min-w-0">
        <div className="text-[11px] font-medium text-gray-500 tabular-nums text-left">
          #{rank}
        </div>
        <div
          className="w-3 h-3 rounded-full justify-self-center"
          style={{ backgroundColor: hex }}
        />
        <span className="text-[13px] font-medium text-gray-800 truncate">
          {word}
        </span>
      </div>
      <div className="text-[11px] text-gray-700 tabular-nums w-12 text-right">
        {percentText}
      </div>
    </div>
  );
}

export function StatsPanel({ stats, loading, error }: StatsPanelProps) {
  // Maintain a stable displayed word and cross-fade on change; preserve previous during refresh
  const [displayedWord, setDisplayedWord] = useState<string>('');
  const [prevWord, setPrevWord] = useState<string | null>(null);
  const [currentVisible, setCurrentVisible] = useState<boolean>(true);
  const fadeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const nextWord = stats?.top?.word || '';
    if (!nextWord && loading) return; // keep previous while fetching
    if (!displayedWord && !prevWord && nextWord) {
      setDisplayedWord(nextWord);
      setCurrentVisible(true);
      return;
    }
    if (!nextWord) return;
    if (nextWord !== displayedWord) {
      setPrevWord(displayedWord || null);
      setDisplayedWord(nextWord);
      setCurrentVisible(false);
      const id1 = requestAnimationFrame(() => {
        const id2 = requestAnimationFrame(() => setCurrentVisible(true));
        (setCurrentVisible as unknown as { __id2?: number }).__id2 = id2;
      });
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = window.setTimeout(() => setPrevWord(null), 450);
      return () => cancelAnimationFrame(id1);
    }
  }, [stats?.top?.word, loading, displayedWord, prevWord]);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
      const anySet = setCurrentVisible as unknown as { __id2?: number };
      if (anySet.__id2) cancelAnimationFrame(anySet.__id2);
    };
  }, []);

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

  // Removed duplicate early declarations; see unified section below
  const your = stats?.yourWord;
  const total = stats?.total || 0;
  const yourPercentText = your ? formatPercent(your.count, total) : undefined;
  const yourHex = your ? getEmotionColor(your.word) || '#6DCFF6' : undefined;
  const [hexCopied, setHexCopied] = useState(false);
  const hexCopyTimerRef = useRef<number | null>(null);
  const top10 = stats?.top10 ?? stats?.top5 ?? [];
  // Expansion and scrolling removed to keep the stats as a simple snapshot (top 3 only)

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
  }, [your?.word]);

  async function handleCopyHex(): Promise<void> {
    if (!yourHex) return;
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
  }

  // Remove leftover duplicate measurement effect from prior refactor

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Main emotion - hero section */}
      <div className="mb-8 md:mb-16">
        <div className="text-center space-y-6 md:space-y-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-gray-800 leading-tight md:whitespace-nowrap">
            The world feels
          </h1>
          <div
            className="relative mx-auto inline-block"
            style={{ minHeight: '1em' }}
          >
            {/* Current word */}
            <span
              className={[
                'block absolute left-1/2 -translate-x-1/2 text-5xl sm:text-6xl md:text-7xl font-semibold transition-opacity duration-500 ease-out',
                currentVisible ? 'opacity-100' : 'opacity-0',
              ].join(' ')}
              style={{
                color: getEmotionColor(displayedWord) || '#6DCFF6',
              }}
            >
              {displayedWord || '\u00A0'}
            </span>
            {/* Previous word during cross-fade */}
            {prevWord && (
              <span
                className={[
                  'block absolute left-1/2 -translate-x-1/2 text-6xl md:text-7xl font-semibold transition-opacity duration-500 ease-out',
                  currentVisible ? 'opacity-0' : 'opacity-100',
                ].join(' ')}
                style={{
                  color: getEmotionColor(prevWord) || '#6DCFF6',
                }}
                aria-hidden="true"
              >
                {prevWord}
              </span>
            )}
            {/* Invisible placeholder to reserve height and center layout */}
            <span className="invisible text-6xl md:text-7xl font-semibold">
              W
            </span>
          </div>
        </div>
      </div>

      {/* Your contribution chip (centered, glassy) */}
      <div className="mt-1.5 mb-4">
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
                      <span
                        className="font-semibold"
                        style={{ color: yourHex || undefined }}
                      >
                        {your.word}
                      </span>
                    </span>
                    <span className="h-4 w-px bg-white/50" />
                    <span className="text-sm text-gray-800 tabular-nums whitespace-nowrap">
                      {yourPercentText} match
                    </span>
                  </div>
                  {/* HEX token on desktop/tablet (right side) */}
                  <button
                    type="button"
                    onClick={handleCopyHex}
                    title="Copy HEX"
                    className="hidden sm:inline-flex glass-token items-center gap-1.5 text-[10px] font-mono tracking-normal text-gray-700 rounded-xl px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 whitespace-nowrap"
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-[3px]"
                      style={{ backgroundColor: yourHex }}
                      aria-hidden
                    />
                    <span
                      className="inline-block w-[8ch] text-left"
                      aria-live="polite"
                    >
                      {hexCopied ? 'COPIED' : (yourHex || '').toUpperCase()}
                    </span>
                  </button>
                </div>
                {/* HEX token on mobile (second row) */}
                <div className="mt-1 sm:hidden w-full flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleCopyHex}
                    title="Copy HEX"
                    className="glass-token inline-flex items-center gap-1.5 text-[10px] font-mono tracking-normal text-gray-700 rounded-xl px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 whitespace-nowrap"
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-[3px]"
                      style={{ backgroundColor: yourHex }}
                      aria-hidden
                    />
                    <span
                      className="inline-block w-[8ch] text-left"
                      aria-live="polite"
                    >
                      {hexCopied ? 'COPIED' : (yourHex || '').toUpperCase()}
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
        <div className="px-5 py-4 md:px-6 md:py-5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg mb-4">
          <div className="space-y-1.5">
            {top10.slice(0, 3).map((item, index) => (
              <WordBadge
                key={item.word}
                word={item.word}
                count={item.count}
                total={total}
                rank={index + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
