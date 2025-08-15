import { useState, useCallback, useEffect, useRef } from 'react';
import { apiClient } from '@lib/apiClient';
import type { Stats, StatsQuery } from '@worldfeel/shared';

interface UseStatsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  requestTimeout?: number;
}

interface UseStatsReturn {
  stats: Stats | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setFilters: (filters: StatsQuery) => void;
}

const DEFAULT_REFRESH_INTERVAL = 30000; // 30 seconds (increased from 15s)
const DEFAULT_REQUEST_TIMEOUT = 8000; // 8 seconds for stats requests

export function useStats(
  initialFilters: StatsQuery = {},
  options: UseStatsOptions = {}
): UseStatsReturn {
  const {
    autoRefresh = true,
    refreshInterval = DEFAULT_REFRESH_INTERVAL,
    requestTimeout = DEFAULT_REQUEST_TIMEOUT,
  } = options;

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StatsQuery>(initialFilters);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchStats = useCallback(async () => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    try {
      setError(null);

      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();

      const response = await apiClient.getStats(filters, {
        timeout: requestTimeout,
      });

      if (mountedRef.current && response.success && response.data) {
        setStats(response.data);
        // Clear error if we successfully got data (even if it's fallback data)
        setError(null);
      } else if (mountedRef.current && !response.success) {
        setError(response.error || 'Failed to fetch stats');
      }
    } catch (err) {
      if (mountedRef.current) {
        // Only set error if we're not using fallback data
        // The API client will handle fallback internally, so if we reach here,
        // it means there's a real error that couldn't be handled by fallback
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        abortControllerRef.current = null;
      }
    }
  }, [filters, requestTimeout]);

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
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
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
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
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
