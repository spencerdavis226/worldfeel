import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GlassyBackground } from '../components/GlassyBackground';
import { getDeviceId } from '../utils/device';
import { apiClient } from '../utils/api';
import { lettersOnly } from '@worldfeel/shared';
import { navigateWithViewTransition } from '../utils/navigation';
import { resolveEmotionKey } from '@worldfeel/shared/emotion-color-map';

export function HomePage() {
  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number | null>(null);
  const navigate = useNavigate();

  // Since spam protection is disabled for testing, we don't need to check for existing submissions
  useEffect(() => {
    setCheckingExisting(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
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
        // Navigate to results page
        navigateWithViewTransition('/results', navigate);
      } else {
        setError(response.error || 'Something went wrong');
      }
    } catch (err) {
      if (err instanceof Error) {
        // If they've already submitted, redirect to results instead of showing error
        if (
          err.message.includes('Already submitted') ||
          err.message.includes('already shared')
        ) {
          navigate('/results');
          return;
        }
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const resp = await apiClient.searchEmotions(q, 12);
      if (resp.success && Array.isArray(resp.data)) {
        setSuggestions(resp.data);
      }
    } catch {
      // ignore errors for suggestions
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
        }
      } else {
        // Prevent free-enter submission unless a selection was made
        e.preventDefault();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

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

  // Randomize hue start each load for subtle variation (must be before any early returns)
  const hueStartDeg = useMemo(() => Math.floor(Math.random() * 360), []);

  // Show loading state while checking for existing submissions
  if (checkingExisting) {
    return (
      <GlassyBackground
        hueCycle
        hueStartDeg={hueStartDeg}
        hueDurationMs={20000}
      >
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </GlassyBackground>
    );
  }

  return (
    <GlassyBackground hueCycle hueStartDeg={hueStartDeg} hueDurationMs={20000}>
      <div className="min-h-screen flex flex-col items-center justify-between p-4">
        {/* Top spacer */}
        <div></div>

        {/* Main content - centered (animate only content, keep footer static) */}
        <div className="w-full max-w-xl mx-auto text-center px-4 sm:px-2 animate-fade-in">
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
                placeholder="peaceful, excited..."
                className="w-full pl-6 pr-20 sm:pr-14 py-6 sm:py-5 text-xl sm:text-xl text-center bg-white/25 backdrop-blur-xl border border-white/30 rounded-2xl placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-200 shadow-lg min-h-[64px] sm:min-h-[60px]"
                disabled={loading}
                autoFocus
                autoComplete="off"
                spellCheck="false"
                maxLength={20}
                aria-autocomplete="list"
                aria-expanded={showSuggestions}
                aria-controls="emotion-suggestions"
              />

              {/* Submit button: only visible when a dropdown selection has been made */}
              {selectedKey && (
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-11 sm:h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400/50 shadow-lg"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg
                      className="w-5 h-5"
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
                  className="absolute left-0 right-0 top-full mt-2 z-20 bg-white/80 backdrop-blur-xl border border-black/5 rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
                >
                  <div className="max-h-72 overflow-auto divide-y divide-black/5">
                    {suggestions.map((s, idx) => (
                      <button
                        type="button"
                        key={`${s}-${idx}`}
                        role="option"
                        aria-selected={idx === highlightIndex}
                        onMouseDown={(ev) => ev.preventDefault()}
                        onClick={() => {
                          const resolved = resolveEmotionKey(s);
                          if (!resolved) return;
                          setWord(s);
                          setSelectedKey(resolved);
                          setShowSuggestions(false);
                          setSuggestions([]);
                        }}
                        className={`w-full text-left px-5 py-3 transition-colors ${
                          idx === highlightIndex ? 'bg-white' : 'hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-800 text-base">{s}</span>
                          {idx === highlightIndex && (
                            <svg
                              className="w-4 h-4 text-gray-500"
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
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className="text-red-600 text-sm bg-red-50/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Footer - bottom of viewport */}
        <div className="w-full text-center space-y-3 pb-6 px-4">
          <p className="text-sm text-gray-500">
            A global emotional snapshot of today
          </p>
          <div className="flex items-center justify-center space-x-6 text-xs sm:text-xs text-gray-400">
            <Link
              to="/about"
              className="hover:text-gray-600 transition-colors underline py-2"
            >
              About
            </Link>
            <span>•</span>
            <button
              type="button"
              onClick={() => navigateWithViewTransition('/results', navigate)}
              className="hover:text-gray-600 transition-colors underline py-2"
            >
              View Results
            </button>
          </div>
        </div>
      </div>
    </GlassyBackground>
  );
}
