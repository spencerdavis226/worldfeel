import { useState, useCallback, useEffect, useRef } from 'react';
import { apiClient } from '@lib/apiClient';
import type { Stats, StatsQuery } from '@worldfeel/shared';

interface UseStatsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseStatsReturn {
  stats: Stats | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setFilters: (filters: StatsQuery) => void;
}

const DEFAULT_REFRESH_INTERVAL = 10000; // 10 seconds

export function useStats(
  initialFilters: StatsQuery = {},
  options: UseStatsOptions = {}
): UseStatsReturn {
  const { autoRefresh = true, refreshInterval = DEFAULT_REFRESH_INTERVAL } =
    options;

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StatsQuery>(initialFilters);

  // Update filters when initialFilters change
  useEffect(() => {
    const newFiltersString = JSON.stringify(initialFilters);

    if (prevInitialFiltersRef.current !== newFiltersString) {
      prevInitialFiltersRef.current = newFiltersString;
      setFilters(initialFilters);
      // Trigger a refresh when filters actually change
      if (mountedRef.current) {
        setLoading(true);
      }
    }
  }, [initialFilters]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);
  const prevInitialFiltersRef = useRef<string>('');

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const response = await apiClient.getStats(filters);

      if (mountedRef.current && response.success && response.data) {
        setStats(response.data);
        setError(null);
      } else if (mountedRef.current && !response.success) {
        setError(response.error || 'Failed to fetch stats');
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [filters]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchStats();
  }, [fetchStats]);

  const updateFilters = useCallback((newFilters: StatsQuery) => {
    setFilters(newFilters);
    setLoading(true);
  }, []);

  // Listen for pending submission processing
  useEffect(() => {
    const handlePendingSubmissionsProcessed = () => {
      // When pending submissions are processed, refresh stats to show real data
      if (mountedRef.current) {
        console.info(
          '🌐 [WorldFeel] Pending submissions processed, refreshing stats'
        );
        refresh();
      }
    };

    apiClient.setOnPendingSubmissionsProcessed(
      handlePendingSubmissionsProcessed
    );

    return () => {
      apiClient.setOnPendingSubmissionsProcessed(() => {});
    };
  }, [refresh]);

  // Initial fetch and setup auto-refresh
  useEffect(() => {
    fetchStats();

    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchStats();
      }, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchStats, autoRefresh, refreshInterval]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    stats,
    loading,
    error,
    refresh,
    setFilters: updateFilters,
  };
}
