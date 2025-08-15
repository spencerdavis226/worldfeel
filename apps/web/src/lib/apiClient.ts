import type {
  ApiResponse,
  SubmissionRequest,
  SubmissionResponse,
  Stats,
  StatsQuery,
  ColorResult,
} from '@worldfeel/shared';
import { getApiBaseUrl } from '@lib/env.js';
import { generateMockStats, generateMockEmotions } from './mockData.js';

// Type for fetch request options
type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  credentials?: 'include' | 'omit' | 'same-origin';
  timeout?: number;
};

// Server status tracking
let serverStatus = {
  isOnline: true,
  lastCheck: 0,
  spinUpTime: 70000, // 70 seconds estimated spin-up time
};

// Temporary testing flag - set to true to force offline mode
const FORCE_OFFLINE_MODE = false; // Set to true to test offline mode

// Track pending submissions to submit when server comes back online
let pendingSubmissions: SubmissionRequest[] = [];

// Default timeout for requests (important for Render.com cold starts)
const DEFAULT_REQUEST_TIMEOUT = 10000; // 10 seconds

// Check if server is likely spinning up
function isServerSpinningUp(): boolean {
  const now = Date.now();
  const timeSinceLastCheck = now - serverStatus.lastCheck;

  // If we haven't checked recently or the last check was recent, assume spinning up
  if (timeSinceLastCheck < serverStatus.spinUpTime) {
    return true;
  }

  return false;
}

// Log server status for debugging (only in console, no visual indicators)
function logServerStatus(
  endpoint: string,
  error: Error,
  isFallback: boolean = false
): void {
  const now = Date.now();
  const timeSinceLastCheck = now - serverStatus.lastCheck;

  if (isFallback) {
    console.warn(
      `🌐 [WorldFeel] Server offline - using fallback data for ${endpoint}`
    );
    console.info(
      `🌐 [WorldFeel] Last server check: ${Math.round(timeSinceLastCheck / 1000)}s ago`
    );

    if (isServerSpinningUp()) {
      const remainingTime = Math.max(
        0,
        serverStatus.spinUpTime - timeSinceLastCheck
      );
      console.info(
        `🌐 [WorldFeel] Server likely spinning up - estimated ${Math.round(remainingTime / 1000)}s remaining`
      );
    }
  } else {
    console.error(`🌐 [WorldFeel] API Error [${endpoint}]:`, error);
    serverStatus.isOnline = false;
    serverStatus.lastCheck = now;
  }
}

// Submit pending submissions when server comes back online
async function submitPendingSubmissions(): Promise<void> {
  if (pendingSubmissions.length === 0) return;

  console.info(
    `🌐 [WorldFeel] Server back online - submitting ${pendingSubmissions.length} pending submissions`
  );

  const submissionsToProcess = [...pendingSubmissions];
  pendingSubmissions = []; // Clear the array

  for (const submission of submissionsToProcess) {
    try {
      // Create a temporary API client instance to submit the pending submission
      const tempClient = new ApiClient(getApiBaseUrl());
      await tempClient.request<Stats>('/submit', {
        method: 'POST',
        body: JSON.stringify(submission),
      });
      console.info(
        `🌐 [WorldFeel] Successfully submitted pending word: ${submission.word}`
      );
    } catch (error) {
      console.warn(
        `🌐 [WorldFeel] Failed to submit pending word: ${submission.word}`,
        error
      );
      // Re-add to pending if it failed
      pendingSubmissions.push(submission);
    }
  }
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    // Force offline mode for testing
    if (FORCE_OFFLINE_MODE) {
      throw new Error('Forced offline mode for testing');
    }

    const url = `${this.baseUrl}/api${endpoint}`;
    const timeout = options.timeout || DEFAULT_REQUEST_TIMEOUT;

    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    const config: RequestOptions = {
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        // Create a more detailed error with status code
        const errorMessage =
          data.message || data.error || `HTTP ${response.status}`;
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        (error as any).statusText = response.statusText;
        throw error;
      }

      // Server is online, update status and submit pending submissions
      const wasOffline = !serverStatus.isOnline;
      serverStatus.isOnline = true;
      serverStatus.lastCheck = Date.now();

      // If server just came back online, submit pending submissions
      if (wasOffline) {
        // Use setTimeout to avoid blocking the current request
        setTimeout(() => {
          submitPendingSubmissions();
        }, 100);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle timeout/abort specifically
      if (error instanceof Error && error.name === 'AbortError') {
        const timeoutError = new Error(`Request timeout after ${timeout}ms`);
        logServerStatus(endpoint, timeoutError);
        throw timeoutError;
      }

      logServerStatus(
        endpoint,
        error instanceof Error ? error : new Error('Network error')
      );
      throw error instanceof Error ? error : new Error('Network error');
    }
  }

  async submitWord(
    data: SubmissionRequest,
    options: { timeout?: number } = {}
  ): Promise<SubmissionResponse> {
    try {
      return await this.request<Stats>('/submit', {
        method: 'POST',
        body: JSON.stringify(data),
        ...options,
      });
    } catch (error) {
      // Fallback: simulate successful submission with mock data
      logServerStatus(
        '/submit',
        error instanceof Error ? error : new Error('Network error'),
        true
      );

      // Add to pending submissions to submit when server comes back online
      pendingSubmissions.push(data);

      // Simulate the user's word being saved locally
      try {
        localStorage.setItem('wf.yourWord', data.word.trim().toLowerCase());
      } catch {
        // Ignore localStorage errors
      }

      const mockStats = generateMockStats(data.word.trim().toLowerCase());

      return {
        success: true,
        data: mockStats,
        message: 'Thank you for sharing how you feel!',
        canEdit: true,
        editWindowMinutes: 5,
      };
    }
  }

  async getStats(
    params: StatsQuery = {},
    options: { timeout?: number } = {}
  ): Promise<ApiResponse<Stats>> {
    try {
      const searchParams = new URLSearchParams();

      if (params.yourWord) searchParams.set('yourWord', params.yourWord);

      const query = searchParams.toString();
      const endpoint = `/stats${query ? `?${query}` : ''}`;

      return await this.request<Stats>(endpoint, options);
    } catch (error) {
      // Fallback: return mock stats
      logServerStatus(
        '/stats',
        error instanceof Error ? error : new Error('Network error'),
        true
      );

      const mockStats = generateMockStats(params.yourWord);

      return {
        success: true,
        data: mockStats,
      };
    }
  }

  async getWordColor(word: string): Promise<ApiResponse<ColorResult>> {
    try {
      const searchParams = new URLSearchParams({ word });
      return await this.request<ColorResult>(`/color?${searchParams}`);
    } catch (error) {
      // Fallback: return mock color data
      logServerStatus(
        '/color',
        error instanceof Error ? error : new Error('Network error'),
        true
      );

      return {
        success: true,
        data: {
          hex: '#6DCFF6',
          shadeHex: '#5BC0E5',
          name: 'Ocean Blue',
          matched: false,
        },
      };
    }
  }

  async searchEmotions(
    query: string,
    limit: number = 20,
    options: { timeout?: number } = {}
  ): Promise<ApiResponse<string[]>> {
    try {
      const params = new URLSearchParams();
      params.set('q', query);
      if (limit) params.set('limit', String(limit));
      return await this.request<string[]>(
        `/emotions/search?${params.toString()}`,
        options
      );
    } catch (error) {
      // Fallback: return mock emotion search results
      logServerStatus(
        '/emotions/search',
        error instanceof Error ? error : new Error('Network error'),
        true
      );

      const mockResults = generateMockEmotions(query);

      return {
        success: true,
        data: mockResults,
      };
    }
  }

  async flagContent(data: {
    word?: string;
    reason?: string;
  }): Promise<ApiResponse<void>> {
    try {
      return await this.request<void>('/flag', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      // Fallback: simulate successful flag
      logServerStatus(
        '/flag',
        error instanceof Error ? error : new Error('Network error'),
        true
      );

      return {
        success: true,
      };
    }
  }

  async healthCheck(): Promise<ApiResponse<{ timestamp: string }>> {
    try {
      const result = await this.request<{ timestamp: string }>('/health');
      return result;
    } catch (error) {
      logServerStatus(
        '/health',
        error instanceof Error ? error : new Error('Network error'),
        true
      );

      return {
        success: false,
        error: 'Server unavailable',
      };
    }
  }

  // Method to check if server is online
  isServerOnline(): boolean {
    return serverStatus.isOnline;
  }

  // Method to get server status info
  getServerStatus() {
    return { ...serverStatus };
  }

  // Method to get pending submissions count (for debugging)
  getPendingSubmissionsCount(): number {
    return pendingSubmissions.length;
  }
}

export const apiClient = new ApiClient(getApiBaseUrl());
// Remove unused default export
