import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UniversalBackground } from '@components/UniversalBackground';
import { getDeviceId } from '@lib/deviceId';
import { apiClient } from '@lib/apiClient';
import { lettersOnly } from '@worldfeel/shared';
import { navigateWithViewTransition } from '@lib/viewTransitions';
import {
  resolveEmotionKey,
  getEmotionColor,
  EmotionColorMap,
} from '@worldfeel/shared/emotion-color-map';
import { usePageTitle } from '@hooks/usePageTitle';
import { timeAsyncFunction } from '@lib/performance';

export function HomePage() {
  // Set page title for main page
  usePageTitle('', true);

  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [canSubmit, setCanSubmit] = useState<boolean>(true);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined);
  // Accent/background control
  const [accentHex, setAccentHex] = useState<string>('#6DCFF6');
  // Placeholder rotation
  const emotionKeys = useMemo(() => Array.from(EmotionColorMap.keys()), []);
  const [placeholderWord, setPlaceholderWord] = useState<string>(() => {
    const initial =
      emotionKeys[Math.floor(Math.random() * emotionKeys.length)] || 'peace';
    return initial;
  });
  const [placeholderVisible, setPlaceholderVisible] = useState<boolean>(true);
  const rotateRef = useRef<number | null>(null);
  const cooldownTimerRef = useRef<number | null>(null);
  const cooldownFadeTimeoutRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const [cooldownVisible, setCooldownVisible] = useState<boolean>(false);

  // Check submit cooldown status once on mount
  useEffect(() => {
    (async () => {
      try {
        const deviceId = getDeviceId();
        const resp = await apiClient.getSubmitStatus({ deviceId });
        if (resp.success && resp.data) {
          setCanSubmit(resp.data.canSubmit);
          setRemainingSeconds(resp.data.remainingSeconds || 0);
          setCooldownVisible(
            !resp.data.canSubmit && (resp.data.remainingSeconds || 0) > 0
          );
        } else {
          setCanSubmit(true);
          setRemainingSeconds(0);
          setCooldownVisible(false);
        }
      } catch {
        // Fail open
        setCanSubmit(true);
        setRemainingSeconds(0);
        setCooldownVisible(false);
      } finally {
        setCheckingExisting(false);
      }
    })();
  }, []);

  // Countdown tick while locked
  useEffect(() => {
    if (!canSubmit && remainingSeconds > 0) {
      if (cooldownTimerRef.current) {
        window.clearInterval(cooldownTimerRef.current);
        cooldownTimerRef.current = null;
      }
      setCooldownVisible(true);
      cooldownTimerRef.current = window.setInterval(() => {
        setRemainingSeconds((s) => {
          if (s <= 1) {
            if (cooldownTimerRef.current) {
              window.clearInterval(cooldownTimerRef.current);
              cooldownTimerRef.current = null;
            }
            setCanSubmit(true);
            // Trigger fade out; keep visible briefly during transition
            if (cooldownFadeTimeoutRef.current) {
              window.clearTimeout(cooldownFadeTimeoutRef.current);
              cooldownFadeTimeoutRef.current = null;
            }
            cooldownFadeTimeoutRef.current = window.setTimeout(() => {
              setCooldownVisible(false);
            }, 650);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (cooldownTimerRef.current) {
        window.clearInterval(cooldownTimerRef.current);
        cooldownTimerRef.current = null;
      }
      if (cooldownFadeTimeoutRef.current) {
        window.clearTimeout(cooldownFadeTimeoutRef.current);
        cooldownFadeTimeoutRef.current = null;
      }
    };
  }, [canSubmit, remainingSeconds]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      // Only allow submit when a dropdown selection has been made (valid emotion)
      if (!selectedKey) return;

      setLoading(true);
      setError('');

      try {
        const deviceId = getDeviceId();
        const response = await apiClient.submitWord({
          // Submit the selected emotion; keep the visible input in sync when selecting
          word: word.trim().toLowerCase(),
          deviceId,
          // No location data for MVP
        });

        if (response.success) {
          // Persist your word locally for stats personalization
          try {
            localStorage.setItem('wf.yourWord', word.trim().toLowerCase());
          } catch {
            // Ignore localStorage errors
          }
          // Navigate to results page
          navigateWithViewTransition('/results', navigate);
        } else {
          setError(response.error || 'Something went wrong');
        }
      } catch (err) {
        // On cooldown error, update status and show subtle notice instead of error
        try {
          const status = await apiClient.getSubmitStatus({
            deviceId: getDeviceId(),
          });
          if (status.success && status.data) {
            setCanSubmit(status.data.canSubmit);
            setRemainingSeconds(status.data.remainingSeconds || 0);
            setError('');
            return;
          }
        } catch {
          // Ignore status check errors
        }
        if (err instanceof Error) setError(err.message);
        else setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [selectedKey, word, navigate]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      // Allow only letters and limit length, or allow empty string for backspacing
      if ((newValue === '' || lettersOnly(newValue)) && newValue.length <= 20) {
        setWord(newValue);
        if (error) setError(''); // Clear error when user types
        setShowSuggestions(true);
        setHighlightIndex(-1);
        // Typing invalidates the previous explicit selection
        setSelectedKey(undefined);
      }
    },
    [error]
  );

  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const resp = await timeAsyncFunction(
        `emotion-search-${q}`,
        () => apiClient.searchEmotions(q, 12),
        50 // Log if takes longer than 50ms
      );
      if (resp.success && Array.isArray(resp.data)) {
        setSuggestions(resp.data);
      }
    } catch {
      // Ignore errors for suggestions
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      fetchSuggestions(word);
    }, 140);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [word, fetchSuggestions]);

  // When the visible word perfectly matches a known emotion key, tint the background immediately.
  useEffect(() => {
    const resolved = resolveEmotionKey(word);
    const hex = resolved ? getEmotionColor(word) : undefined;
    if (hex) {
      setAccentHex(hex);
    }
  }, [word]);

  // Rotate placeholder every 2s when input is empty; also drive background from placeholder color
  useEffect(() => {
    // If user has typed anything, stop rotating; background only changes for valid input now
    if (word.trim() !== '') {
      if (rotateRef.current) {
        window.clearInterval(rotateRef.current);
        rotateRef.current = null;
      }
      return;
    }
    // Start rotation
    if (rotateRef.current) {
      window.clearInterval(rotateRef.current);
      rotateRef.current = null;
    }
    // Immediately sync background to current placeholder
    const currentHex = getEmotionColor(placeholderWord);
    if (currentHex) setAccentHex(currentHex);
    rotateRef.current = window.setInterval(() => {
      // fade out
      setPlaceholderVisible(false);
      window.setTimeout(() => {
        const next =
          emotionKeys[Math.floor(Math.random() * emotionKeys.length)] ||
          'peace';
        setPlaceholderWord(next);
        const hex = getEmotionColor(next);
        if (hex) setAccentHex(hex);
        // fade in
        setPlaceholderVisible(true);
      }, 220);
    }, 3000);
    return () => {
      if (rotateRef.current) {
        window.clearInterval(rotateRef.current);
        rotateRef.current = null;
      }
    };
  }, [word, emotionKeys, placeholderWord]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions || suggestions.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIndex((idx) => (idx + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIndex(
          (idx) => (idx - 1 + suggestions.length) % suggestions.length
        );
      } else if (e.key === 'Enter') {
        if (highlightIndex >= 0) {
          e.preventDefault();
          const pick = suggestions[highlightIndex]!;
          const resolved = resolveEmotionKey(pick);
          if (resolved) {
            setWord(pick);
            setSelectedKey(resolved);
            setShowSuggestions(false);
            setSuggestions([]);
            // Lock background to the selected emotion color
            const hex = getEmotionColor(pick) || '#6DCFF6';
            setAccentHex(hex);
          }
        } else {
          // Prevent free-enter submission unless a selection was made
          e.preventDefault();
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    },
    [showSuggestions, suggestions.length, highlightIndex]
  );

  // Close suggestions when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!inputRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!inputRef.current.parentElement?.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // No hue cycling; background color driven by placeholder or valid input

  // Show loading state while checking for existing submissions
  if (checkingExisting) {
    return (
      <UniversalBackground centerColorHex={accentHex} hueCycle={false}>
        <div className="min-h-[100vh] min-h-[100svh] min-h-[100dvh] flex flex-col items-center justify-center p-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </UniversalBackground>
    );
  }

  return (
    <UniversalBackground centerColorHex={accentHex} hueCycle={false}>
      <div className="min-h-[100vh] min-h-[100svh] min-h-[100dvh] flex flex-col items-center justify-center p-4 ios-layout-fix">
        {/* Main content - moved up significantly */}
        <div className="w-full max-w-xl mx-auto text-center px-4 sm:px-2 animate-fade-in -mt-32 sm:-mt-40">
          {/* Main prompt */}
          <div className="mb-12 md:mb-16">
            <h1 className="text-4xl sm:text-4xl md:text-5xl font-medium text-gray-800 leading-tight md:whitespace-nowrap">
              How are you feeling today?
            </h1>
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={word}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                id="feeling"
                name="feeling"
                placeholder=""
                className="w-full pl-20 pr-20 sm:pl-14 sm:pr-14 py-6 sm:py-5 text-xl sm:text-xl text-center bg-white/25 backdrop-blur-xl border border-white/30 rounded-2xl placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-0 focus:border-white/30 transition-all duration-200 shadow-lg min-h-[64px] sm:min-h-[60px]"
                disabled={loading}
                autoComplete="off"
                spellCheck="false"
                maxLength={20}
                aria-autocomplete="list"
                aria-expanded={showSuggestions}
                aria-controls="emotion-suggestions"
              />
              {/* Rotating placeholder overlay (only when input is empty) */}
              {word.trim() === '' && (
                <div
                  className={`pointer-events-none absolute inset-0 flex items-center justify-center text-gray-500 select-none transition-opacity duration-300 ${
                    placeholderVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {placeholderWord}
                </div>
              )}

              {/* Submit button with smooth crossfade transitions */}
              {canSubmit && selectedKey && (
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-11 sm:h-11 glass-submit-button flex items-center justify-center focus-visible-ring submit-button-enter"
                  aria-label="Submit emotion"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-gray-800/30 border-t-gray-800 rounded-full animate-spin" />
                  ) : (
                    <svg
                      className="w-5 h-5 text-gray-800 drop-shadow-sm"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  )}
                </button>
              )}

              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  id="emotion-suggestions"
                  role="listbox"
                  className="absolute left-0 right-0 top-full mt-2 z-20 glass-panel no-top-line overflow-hidden p-1 shadow-glass-lg animate-pop-in origin-top dropdown-mobile-container"
                >
                  <div className="max-h-72 sm:max-h-72 max-h-[calc(4*3.5rem+0.5rem)] overflow-auto custom-scrollbar space-y-1 p-0.5">
                    {suggestions.map((s, idx) => {
                      const hex = getEmotionColor(s) || '#6DCFF6';
                      const isActive = idx === highlightIndex;
                      return (
                        <button
                          type="button"
                          key={`${s}-${idx}`}
                          role="option"
                          aria-selected={isActive}
                          onMouseDown={(ev) => ev.preventDefault()}
                          onClick={() => {
                            const resolved = resolveEmotionKey(s);
                            if (!resolved) return;
                            setWord(s);
                            setSelectedKey(resolved);
                            setShowSuggestions(false);
                            setSuggestions([]);
                          }}
                          className={`w-full text-left px-4 sm:px-5 py-3 rounded-xl border transition-all focus-visible-ring shadow-inner-highlight backdrop-blur-sm ${
                            isActive
                              ? 'bg-white/60 border-white/40'
                              : 'bg-white/35 hover:bg-white/45 active:bg-white/55 border-white/30'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <span
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: hex }}
                              />
                              <span className="text-gray-800 text-base truncate">
                                {s}
                              </span>
                            </div>
                            {isActive && (
                              <svg
                                className="w-4 h-4 text-gray-600 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-7.364 7.364a1 1 0 01-1.414 0L3.293 9.536a1 1 0 011.414-1.414l3.222 3.222 6.657-6.657a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Cooldown inline notice - styled like the input's glass */}
            {cooldownVisible && (
              <div className="flex items-center justify-center mt-5 md:mt-7">
                <div
                  className={`px-5 py-3 rounded-2xl bg-white/25 backdrop-blur-xl border border-white/30 text-gray-800 shadow-lg transition-opacity ${
                    showSuggestions && suggestions.length > 0
                      ? 'duration-150 ease-out'
                      : 'duration-500 ease-in'
                  } ${
                    !canSubmit && !(showSuggestions && suggestions.length > 0)
                      ? 'opacity-100'
                      : 'opacity-0 pointer-events-none'
                  }`}
                  aria-hidden={showSuggestions && suggestions.length > 0}
                >
                  <span className="inline-flex items-center gap-2 text-[0.95rem]">
                    <span className="tracking-wide">
                      You can share again in
                    </span>
                    <span className="font-medium tabular-nums text-gray-800">
                      {Math.floor(remainingSeconds / 60)}m{' '}
                      {remainingSeconds % 60}s
                    </span>
                  </span>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="text-red-600 text-sm bg-red-50/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Footer - positioned at bottom with generous spacing */}
        <div
          className={`w-full text-center mb-32 px-4 transition-opacity ios-footer-fix absolute bottom-0 left-0 right-0 ${
            showSuggestions && suggestions.length > 0
              ? 'duration-150 ease-out'
              : 'duration-500 ease-in'
          } ${
            showSuggestions && suggestions.length > 0
              ? 'opacity-0 pointer-events-none'
              : 'opacity-100'
          }`}
          aria-hidden={showSuggestions && suggestions.length > 0}
        >
          <p className="text-sm text-gray-500">
            A global emotional snapshot of today
          </p>
        </div>
      </div>
    </UniversalBackground>
  );
}
