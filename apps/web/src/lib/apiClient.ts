import type {
  ApiResponse,
  SubmissionRequest,
  SubmissionResponse,
  Stats,
  StatsQuery,
  ColorResult,
} from '@worldfeel/shared';
import { getApiBaseUrl } from '@lib/env.js';
import { generateMockStats } from './mockData.js';
import { searchEmotions } from './emotionSearch.js';

// Type for fetch request options
type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  credentials?: 'include' | 'omit' | 'same-origin';
};

// Simple timeout for server requests
const SERVER_TIMEOUT_MS = 2000; // 2 seconds

// Track pending submissions
let pendingSubmissions: SubmissionRequest[] = [];

// Add callback for when pending submissions are processed
let onPendingSubmissionsProcessed: (() => void) | null = null;

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  // Add method to get pending submissions count
  getPendingSubmissionsCount(): number {
    return pendingSubmissions.length;
  }

  // Add method to set callback for pending submissions processed
  setOnPendingSubmissionsProcessed(callback: () => void): void {
    onPendingSubmissionsProcessed = callback;
  }

  // Add method to get server status
  getServerStatus(): {
    isOnline: boolean;
    lastCheck: number;
    spinUpTime: number;
  } {
    return {
      isOnline: pendingSubmissions.length === 0, // Simple heuristic
      lastCheck: Date.now(),
      spinUpTime: 70000, // 70 seconds for Render free tier
    };
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

        console.info(
          `🌐 [WorldFeel] Server back online - submitting ${submissionsToProcess.length} pending submissions`
        );

        for (const submission of submissionsToProcess) {
          try {
            await this.request<Stats>('/submit', {
              method: 'POST',
              body: JSON.stringify(submission),
            });
            console.info(
              `🌐 [WorldFeel] Successfully submitted pending word: ${submission.word}`
            );
          } catch (error) {
            // If submission fails, add it back to pending
            pendingSubmissions.push(submission);
            console.warn(
              `🌐 [WorldFeel] Failed to submit pending word: ${submission.word}, will retry later`
            );
          }
        }

        // Notify that pending submissions have been processed
        if (onPendingSubmissionsProcessed) {
          onPendingSubmissionsProcessed();
        }
      }

      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Network error');
    }
  }

  async submitWord(data: SubmissionRequest): Promise<SubmissionResponse> {
    try {
      const response = await this.request<Stats>('/submit', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      // Save word to localStorage on successful submission (both online and offline)
      try {
        localStorage.setItem('wf.yourWord', data.word.trim().toLowerCase());
        console.info(`🌐 [WorldFeel] Saved word to localStorage: ${data.word}`);
      } catch {
        // Ignore localStorage errors
        console.warn('🌐 [WorldFeel] Failed to save word to localStorage');
      }

      return response;
    } catch (error) {
      // Replace pending submissions with the new one (only keep the most recent)
      pendingSubmissions = [data];

      console.info(
        `🌐 [WorldFeel] Server offline - queuing submission: ${data.word} (${pendingSubmissions.length} pending)`
      );

      // Save locally
      try {
        localStorage.setItem('wf.yourWord', data.word.trim().toLowerCase());
        console.info(`🌐 [WorldFeel] Saved word to localStorage: ${data.word}`);
      } catch {
        // Ignore localStorage errors
        console.warn('🌐 [WorldFeel] Failed to save word to localStorage');
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
      console.info(
        `🌐 [WorldFeel] Server offline - using fallback data for /stats (yourWord: ${params.yourWord || 'none'})`
      );

      // Generate new mock stats with the current yourWord parameter
      // Don't cache when yourWord changes to ensure the "you" chip shows the correct word
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
    // Use client-side search - no server needed
    const results = searchEmotions(query);
    return {
      success: true,
      data: results,
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
}

export const apiClient = new ApiClient(getApiBaseUrl());
