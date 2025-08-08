import type { Stats } from '@worldfeel/shared';
import { getEmotionColor } from '@worldfeel/shared/emotion-color-map';
import { useEffect, useRef, useState } from 'react';

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
  const hex = getEmotionColor(word) || '#6DCFF6';

  return (
    <div className="flex items-center justify-between py-3 md:py-3.5 px-1">
      <div className="flex items-center space-x-3">
        <div className="text-[11px] font-medium text-gray-500 w-6">#{rank}</div>
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: hex }}
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

  const top5 = stats?.top5 || [];

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Main emotion - hero section */}
      <div className="mb-12 md:mb-16">
        <div className="text-center space-y-6 md:space-y-8">
          <h1 className="text-4xl sm:text-4xl md:text-5xl font-medium text-gray-800 leading-tight md:whitespace-nowrap">
            The world feels
          </h1>
          <div
            className="relative mx-auto inline-block"
            style={{ minHeight: '1em' }}
          >
            {/* Current word */}
            <span
              className={[
                'block absolute left-1/2 -translate-x-1/2 text-6xl md:text-7xl font-semibold transition-opacity duration-500 ease-out',
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

      {/* Top emotions list - secondary */}
      {top5.length > 0 && (
        <div className="p-6 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg">
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
      )}
    </div>
  );
}
