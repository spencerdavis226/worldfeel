import React, { useState, useCallback, useEffect } from 'react';
import { GlassyBackground } from '../components/GlassyBackground';
import { WordInputCard } from '../components/WordInputCard';
import { StatsPanel } from '../components/StatsPanel';
import { FiltersTray } from '../components/FiltersTray';
import { ColorBadge } from '../components/ColorBadge';
import { useStats } from '../hooks/useStats';
import { useBackgroundColor } from '../hooks/useBackgroundColor';
import { getDeviceId } from '../utils/device';
import { getLocation } from '../utils/geolocation';
import { apiClient } from '../utils/api';
import type { SubmissionRequest, GeoLocation } from '@worldfeel/shared';

export function MainPage() {
  const [filters, setFilters] = useState({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [canEdit, setCanEdit] = useState(true);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [message, setMessage] = useState<string>('');

  const { stats, loading, error, refresh, setFilters: updateStatsFilters } = useStats(filters);

  // Update background color based on top emotion
  useBackgroundColor(stats?.top?.word);

  // Get user location on mount
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const userLocation = await getLocation();
        if (userLocation) {
          setLocation(userLocation);
        }
      } catch (err) {
        console.warn('Could not detect location:', err);
      }
    };

    detectLocation();
  }, []);

  const handleSubmit = useCallback(async (submission: SubmissionRequest) => {
    setSubmitting(true);
    setMessage('');

    try {
      // Include device ID in submission
      const deviceId = getDeviceId();
      const response = await apiClient.submitWord({
        ...submission,
        deviceId,
      });

      if (response.success && response.data) {
        setCurrentWord(submission.word);
        setCanEdit(response.canEdit || false);

        if (response.message) {
          setMessage(response.message);
        }

        // Refresh stats to show updated data
        await refresh();
      } else {
        throw new Error(response.error || 'Submission failed');
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('Already submitted')) {
        setCanEdit(false);
        // Try to extract the current word from the error message
        const match = err.message.match(/"([^"]+)"/);
        if (match) {
          setCurrentWord(match[1]);
        }
      }
      throw err; // Re-throw to be handled by WordInputCard
    } finally {
      setSubmitting(false);
    }
  }, [refresh]);

  const handleFiltersChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
    updateStatsFilters(newFilters);
  }, [updateStatsFilters]);

  const hasFilters = Object.keys(filters).length > 0;

  return (
    <GlassyBackground colorHex={stats?.colorHex}>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
        {/* Header with filter button */}
        <div className="w-full max-w-4xl flex justify-between items-start">
          <div></div> {/* Spacer */}
          <button
            onClick={() => setFiltersOpen(true)}
            className={`
              glass-button p-3 focus-visible-ring
              ${hasFilters ? 'bg-blue-100/30 border-blue-300/40' : ''}
            `}
            title="Filter by location"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {hasFilters && (
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </div>
          </button>
        </div>

        {/* Success message */}
        {message && (
          <div className="glass-panel px-6 py-3 text-green-700 text-center max-w-md">
            {message}
          </div>
        )}

        {/* Main content */}
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Input section */}
          <div className="flex justify-center">
            <WordInputCard
              onSubmit={handleSubmit}
              loading={submitting}
              canEdit={canEdit}
              currentWord={currentWord}
              location={location || undefined}
            />
          </div>

          {/* Stats section */}
          <div className="flex justify-center">
            <StatsPanel
              stats={stats}
              loading={loading}
              error={error}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">
            A global emotional snapshot, refreshed every day
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
            <a
              href="/about"
              className="hover:text-gray-600 transition-colors underline"
            >
              About
            </a>
            <span>•</span>
            <span>{stats?.total.toLocaleString() || '0'} feelings shared today</span>
          </div>
        </div>

        {/* Color badge */}
        <ColorBadge word={stats?.top?.word} colorHex={stats?.colorHex} />

        {/* Filters tray */}
        <FiltersTray
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          onFiltersChange={handleFiltersChange}
          currentFilters={filters}
        />
      </div>
    </GlassyBackground>
  );
}
