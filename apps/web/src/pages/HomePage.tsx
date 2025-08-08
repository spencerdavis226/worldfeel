import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GlassyBackground } from '../components/GlassyBackground';
import { getDeviceId } from '../utils/device';
import { apiClient } from '../utils/api';
import { lettersOnly } from '@worldfeel/shared';

export function HomePage() {
  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [checkingExisting, setCheckingExisting] = useState(true);
  const navigate = useNavigate();

  // Since spam protection is disabled for testing, we don't need to check for existing submissions
  useEffect(() => {
    setCheckingExisting(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!word.trim()) return;

    setLoading(true);
    setError('');

    try {
      const deviceId = getDeviceId();
      const response = await apiClient.submitWord({
        word: word.trim().toLowerCase(),
        deviceId,
        // No location data for MVP
      });

      if (response.success) {
        // Navigate to results page
        navigate('/results');
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
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && word.trim()) {
      handleSubmit(e as any);
    }
  };

  // Show loading state while checking for existing submissions
  if (checkingExisting) {
    return (
      <GlassyBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </GlassyBackground>
    );
  }

  return (
    <GlassyBackground>
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
                type="text"
                value={word}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="peaceful, excited..."
                className="w-full pl-6 pr-20 sm:pr-14 py-6 sm:py-5 text-xl sm:text-xl text-center bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-200 shadow-lg min-h-[64px] sm:min-h-[60px]"
                disabled={loading}
                autoFocus
                autoComplete="off"
                spellCheck="false"
                maxLength={20}
              />

              {/* Enter button */}
              <button
                type="submit"
                disabled={loading || !word.trim()}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-12 h-12 sm:w-11 sm:h-11 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400/50"
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
            <Link
              to="/results"
              className="hover:text-gray-600 transition-colors underline py-2"
            >
              View Results
            </Link>
          </div>
        </div>
      </div>
    </GlassyBackground>
  );
}
