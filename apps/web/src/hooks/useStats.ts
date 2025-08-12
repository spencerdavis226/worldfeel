import { useState, useEffect, useCallback, useRef } from 'react';
import type { Stats, StatsQuery } from '@worldfeel/shared';
import { apiClient } from '@lib/apiClient.js';

interface UseStatsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
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

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const response = await apiClient.getStats(filters);

      if (mountedRef.current && response.success && response.data) {
        setStats(response.data);
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
    mountedRef.current = true; // Ensure it's set to true on mount
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
