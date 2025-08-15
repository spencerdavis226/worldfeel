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
};

// Simple timeout for server requests
const SERVER_TIMEOUT_MS = 2000; // 2 seconds

// Cache for consistent mock data
let cachedMockStats: Stats | null = null;

// Track pending submissions
let pendingSubmissions: SubmissionRequest[] = [];

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}/api${endpoint}`;

    const config: RequestOptions = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      // Simple timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Request timeout after ${SERVER_TIMEOUT_MS}ms`));
        }, SERVER_TIMEOUT_MS);
      });

      // Race between request and timeout
      const response = await Promise.race([fetch(url, config), timeoutPromise]);
      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.message || data.error || `HTTP ${response.status}`;
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        (error as any).statusText = response.statusText;
        throw error;
      }

      // Submit any pending submissions when server is available
      if (pendingSubmissions.length > 0) {
        const submissionsToProcess = [...pendingSubmissions];
        pendingSubmissions = [];

        for (const submission of submissionsToProcess) {
          try {
            await this.request<Stats>('/submit', {
              method: 'POST',
              body: JSON.stringify(submission),
            });
            console.info(
              `🌐 [WorldFeel] Submitted pending word: ${submission.word}`
            );
          } catch (error) {
            pendingSubmissions.push(submission);
          }
        }
      }

      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Network error');
    }
  }

  async submitWord(data: SubmissionRequest): Promise<SubmissionResponse> {
    try {
      return await this.request<Stats>('/submit', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      // Add to pending submissions
      pendingSubmissions.push(data);

      // Save locally
      try {
        localStorage.setItem('wf.yourWord', data.word.trim().toLowerCase());
      } catch {
        // Ignore localStorage errors
      }

      // Return mock data
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

  async getStats(params: StatsQuery = {}): Promise<ApiResponse<Stats>> {
    try {
      const searchParams = new URLSearchParams();
      if (params.yourWord) searchParams.set('yourWord', params.yourWord);

      const query = searchParams.toString();
      const endpoint = `/stats${query ? `?${query}` : ''}`;

      return await this.request<Stats>(endpoint);
    } catch (error) {
      // Use cached mock stats for consistency
      if (!cachedMockStats) {
        cachedMockStats = generateMockStats(params.yourWord);
      }

      return {
        success: true,
        data: cachedMockStats,
      };
    }
  }

  async getWordColor(word: string): Promise<ApiResponse<ColorResult>> {
    try {
      const searchParams = new URLSearchParams({ word });
      return await this.request<ColorResult>(`/color?${searchParams}`);
    } catch (error) {
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

  async searchEmotions(query: string): Promise<ApiResponse<string[]>> {
    // Always use mock data - no server needed
    const mockResults = generateMockEmotions(query);
    return {
      success: true,
      data: mockResults,
    };
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
      return { success: true };
    }
  }

  async healthCheck(): Promise<ApiResponse<{ timestamp: string }>> {
    try {
      return await this.request<{ timestamp: string }>('/health');
    } catch (error) {
      return {
        success: false,
        error: 'Server unavailable',
      };
    }
  }

  // Utility methods
  getPendingSubmissionsCount(): number {
    return pendingSubmissions.length;
  }

  clearCachedMockData(): void {
    cachedMockStats = null;
  }
}

export const apiClient = new ApiClient(getApiBaseUrl());
