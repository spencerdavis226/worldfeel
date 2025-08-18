import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UniversalBackground } from '@components/UniversalBackground';

import { apiClient } from '@lib/apiClient';
import { navigateWithViewTransition } from '@lib/viewTransitions';
import {
  resolveEmotionKey,
  getEmotionColor,
  EmotionColorMap,
} from '@worldfeel/shared/emotion-color-map';
import { usePageTitle } from '@hooks/usePageTitle';

export function HomePage() {
  // Set page title for main page
  usePageTitle('', true);

  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined);
  const [isContentVisible, setIsContentVisible] = useState(false);
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
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number | null>(null);
  const navigate = useNavigate();

  // No cooldown check needed
  useEffect(() => {
    // Component is ready immediately
  }, []);

  // Mount animation - simple and Apple-like
  useEffect(() => {
    // Small delay to ensure content is ready, then trigger animations
    const timer = setTimeout(() => {
      setIsContentVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Check if the typed word resolves to a valid emotion (either selected from dropdown or typed directly)
      const resolvedEmotion = selectedKey || resolveEmotionKey(word);
      if (!resolvedEmotion) return;

      setLoading(true);
      setError('');

      try {
        const response = await apiClient.submitWord({
          // Submit the resolved canonical emotion key, but keep the visible input as typed
          word: resolvedEmotion,
        });

        if (response.success) {
          // Navigate to results page
          navigateWithViewTransition('/results', navigate);
        } else {
          setError(response.error || 'Something went wrong');
        }
      } catch (err) {
        // Handle errors - but the API client should handle fallback internally
        // This catch block should only trigger for unexpected errors
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
      // Allow any input for search, limit length
      if (newValue.length <= 20) {
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
      const resp = await apiClient.searchEmotions(q);
      if (resp.success && Array.isArray(resp.data)) {
        setSuggestions(resp.data);
      }
    } catch {
      // Ignore errors for suggestions - API client handles fallback with timeout
      // If we reach here, it means there's an unexpected error
      console.warn('Unexpected error fetching suggestions');
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
          // Allow submission if the typed word resolves to a valid emotion
          const resolvedEmotion = resolveEmotionKey(word);
          if (resolvedEmotion) {
            // Don't prevent default - let the form submit
            setSelectedKey(resolvedEmotion);
          } else {
            // Prevent submission if no valid emotion
            e.preventDefault();
          }
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
  if (loading) {
    return (
      <UniversalBackground centerColorHex={accentHex}>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </UniversalBackground>
    );
  }

  return (
    <UniversalBackground centerColorHex={accentHex}>
      <div className="min-h-screen flex flex-col">
        {/* Account for fixed navigation */}
        <div className="h-14 sm:h-16 flex-shrink-0" />

        {/* Main content - simple and centered */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div
            className={`w-full max-w-7xl text-center space-y-12 transition-all duration-1000 ${
              isContentVisible
                ? 'opacity-100 transform translate-y-0'
                : 'opacity-0 transform translate-y-4'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {/* Hero text - simple responsive sizing */}
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-gray-800 leading-tight tracking-tight px-4 lg:whitespace-nowrap transition-all duration-1200 ease-out delay-100 ${
                isContentVisible
                  ? 'opacity-100 transform translate-y-0 scale-100'
                  : 'opacity-0 transform translate-y-6 scale-98'
              }`}
            >
              How are you feeling today?
            </h1>

            {/* Input form - constrained width */}
            <div
              className={`max-w-lg mx-auto transition-all duration-1000 ease-out delay-300 ${
                isContentVisible
                  ? 'opacity-100 transform translate-y-0'
                  : 'opacity-0 transform translate-y-4'
              }`}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="w-full px-6 py-4 text-lg text-center bg-white/25 backdrop-blur-xl border border-white/30 rounded-2xl placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-0 focus:border-white/40 transition-all duration-200 shadow-lg"
                    disabled={loading}
                    autoComplete="off"
                    spellCheck="false"
                    maxLength={20}
                    aria-autocomplete="list"
                    aria-expanded={showSuggestions}
                    aria-controls="emotion-suggestions"
                  />

                  {/* Rotating placeholder */}
                  {word.trim() === '' && (
                    <div
                      className={`pointer-events-none absolute inset-0 flex items-center justify-center text-gray-500 select-none transition-opacity duration-300 ${
                        placeholderVisible ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {placeholderWord}
                    </div>
                  )}

                  {/* Submit button */}
                  {(selectedKey || resolveEmotionKey(word)) && (
                    <button
                      type="submit"
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 glass-submit-button flex items-center justify-center focus-visible-ring"
                      aria-label="Submit emotion"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-gray-800/30 border-t-gray-800 rounded-full animate-spin" />
                      ) : (
                        <svg
                          className="w-4 h-4 text-gray-800"
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
                      className="absolute left-0 right-0 top-full mt-3 z-20 glass-panel no-top-line overflow-hidden p-1 shadow-lg animate-pop-in origin-top"
                    >
                      <div className="max-h-64 overflow-auto custom-scrollbar space-y-1 p-0.5">
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
                              className={`w-full text-left px-4 py-3 rounded-xl border transition-all focus-visible-ring backdrop-blur-sm ${
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

                {/* Error message */}
                {error && (
                  <div className="text-red-600 text-sm bg-red-50/80 backdrop-blur-sm px-4 py-2 rounded-lg animate-pop-in">
                    {error}
                  </div>
                )}
              </form>
            </div>

            {/* Footer tagline */}
            <div
              className={`px-4 transition-all duration-1000 ease-out delay-500 ${
                isContentVisible
                  ? 'opacity-100 transform translate-y-0'
                  : 'opacity-0 transform translate-y-4'
              }`}
            >
              <p
                className={`text-base text-gray-500 transition-opacity ${
                  showSuggestions && suggestions.length > 0
                    ? 'duration-150 ease-out opacity-0 pointer-events-none'
                    : 'duration-500 ease-in opacity-100'
                }`}
                aria-hidden={showSuggestions && suggestions.length > 0}
              >
                A global emotional snapshot of today
              </p>
            </div>
          </div>
        </div>
      </div>
    </UniversalBackground>
  );
}
