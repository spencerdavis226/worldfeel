import { useState, useRef, useEffect } from 'react';
import { lettersOnly } from '@worldfeel/shared';
import type { SubmissionRequest } from '@worldfeel/shared';

interface WordInputCardProps {
  onSubmit: (submission: SubmissionRequest) => Promise<void>;
  loading: boolean;
  canEdit: boolean;
  currentWord?: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
}

export function WordInputCard({
  onSubmit,
  loading,
  canEdit,
  currentWord,
  location
}: WordInputCardProps) {
  const [word, setWord] = useState(currentWord || '');
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      return 'Please share how you\'re feeling';
    }

    if (!lettersOnly(value)) {
      return 'Only letters are allowed';
    }

    if (value.length > 20) {
      return 'Maximum 20 characters';
    }

    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWord(value);
    setTouched(true);

    const validationError = validateWord(value);
    setError(validationError);
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
        country: location?.country,
        region: location?.region,
        city: location?.city,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const isValid = !error && word.trim().length > 0;

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-800">
            How is the world feeling?
          </h1>
          <p className="text-gray-600">
            {canEdit ? 'Share your emotion in one word' : 'You\'ve already shared today'}
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={word}
              onChange={handleInputChange}
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

          {canEdit && (
            <button
              type="submit"
              disabled={!isValid || loading}
              className={`
                w-full py-4 px-6 text-lg font-medium
                glass-button focus-visible-ring
                disabled:opacity-50 disabled:cursor-not-allowed
                ${isValid && !loading
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
                Your feeling today: <span className="font-semibold text-gray-800">"{currentWord}"</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                You can update this for a few more minutes
              </p>
            </div>
          )}
        </div>

        {location && (location.country || location.city) && (
          <div className="text-center text-sm text-gray-500">
            <span>📍 </span>
            {[location.city, location.region, location.country].filter(Boolean).join(', ')}
          </div>
        )}
      </form>
    </div>
  );
}
