import { useState, useRef, useEffect, useCallback } from 'react';
import { lettersOnly } from '@worldfeel/shared';
import { resolveEmotionKey } from '@worldfeel/shared/emotion-color-map';
import type { SubmissionRequest } from '@worldfeel/shared';
import { apiClient } from '../utils/api.js';

interface WordInputCardProps {
  onSubmit: (submission: SubmissionRequest) => Promise<void>;
  loading: boolean;
  canEdit: boolean;
  currentWord?: string;
}

export function WordInputCard({
  onSubmit,
  loading,
  canEdit,
  currentWord,
}: WordInputCardProps) {
  const [word, setWord] = useState(currentWord || '');
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number | null>(null);

  // Focus input on mount
  useEffect(() => {
    if (canEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [canEdit]);

  // Update word when currentWord changes
  useEffect(() => {
    if (currentWord && currentWord !== word) {
      setWord(currentWord);
    }
  }, [currentWord]);

  const validateWord = (value: string): string => {
    if (!value.trim()) {
      return "Please share how you're feeling";
    }

    if (!lettersOnly(value)) {
      return 'Only letters are allowed';
    }

    if (value.length > 20) {
      return 'Maximum 20 characters';
    }
    if (!resolveEmotionKey(value)) {
      return 'Please select a valid emotion from the list';
    }
    return '';
  };

  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const resp = await apiClient.searchEmotions(q, 20);
      if (resp.success && Array.isArray(resp.data)) {
        setSuggestions(resp.data);
      }
    } catch {
      // ignore network errors for suggestions
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWord(value);
    setTouched(true);
    setShowSuggestions(true);
    setHighlightIndex(-1);

    const validationError = validateWord(value);
    setError(validationError);

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      fetchSuggestions(value);
    }, 150);
  };

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
        setWord(pick);
        setShowSuggestions(false);
        setSuggestions([]);
        setError('');
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedWord = word.trim();
    const validationError = validateWord(trimmedWord);

    if (validationError) {
      setError(validationError);
      setTouched(true);
      return;
    }

    try {
      setError('');
      await onSubmit({
        word: trimmedWord,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-800">
            How is the world feeling?
          </h1>
          <p className="text-gray-600">
            {canEdit
              ? 'Share your emotion in one word'
              : "You've already shared today"}
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={word}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="happy, calm, excited, tired..."
              disabled={!canEdit || loading}
              className={`
                w-full px-6 py-4 text-xl text-center
                glass-input focus-visible-ring
                placeholder:text-gray-400
                disabled:opacity-50 disabled:cursor-not-allowed
                ${error && touched ? 'border-red-300 focus:border-red-400' : ''}
              `}
              maxLength={20}
              autoComplete="off"
              spellCheck="false"
            />

            {/* Character counter */}
            <div className="absolute -bottom-6 right-0 text-xs text-gray-400">
              {word.length}/20
            </div>
          </div>

          {error && touched && (
            <div className="text-red-500 text-sm text-center bg-red-50/50 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {canEdit && showSuggestions && suggestions.length > 0 && (
            <div className="glass-panel no-top-line max-h-56 sm:max-h-56 max-h-[calc(4*2.5rem+0.5rem)] overflow-auto rounded-2xl p-1 animate-pop-in origin-top dropdown-mobile-container">
              <div className="space-y-1 p-0.5">
                {suggestions.map((s, idx) => (
                  <button
                    type="button"
                    key={`${s}-${idx}`}
                    onClick={() => {
                      setWord(s);
                      setShowSuggestions(false);
                      setSuggestions([]);
                      setError('');
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl border transition-all focus-visible-ring shadow-inner-highlight ${
                      idx === highlightIndex
                        ? 'bg-white/60 border-white/40'
                        : 'bg-white/35 hover:bg-white/45 active:bg-white/55 border-white/30'
                    }`}
                  >
                    <span className="text-gray-800 text-base">{s}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {canEdit && (
            <button
              type="submit"
              disabled={!resolveEmotionKey(word) || loading}
              className={`
                w-full py-4 px-6 text-lg font-medium
                glass-button focus-visible-ring
                disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  resolveEmotionKey(word) && !loading
                    ? 'hover:shadow-lg transform hover:scale-[1.02]'
                    : ''
                }
                transition-all duration-200
              `}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
                  <span>Sharing...</span>
                </div>
              ) : (
                `Share ${word.trim() ? `"${word.trim()}"` : 'your feeling'}`
              )}
            </button>
          )}

          {!canEdit && currentWord && (
            <div className="text-center p-4 glass-panel">
              <p className="text-gray-600 text-sm">
                Your feeling today:{' '}
                <span className="font-semibold text-gray-800">
                  "{currentWord}"
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                You can update this for a few more minutes
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
