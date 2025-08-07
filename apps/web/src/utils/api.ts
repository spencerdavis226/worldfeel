import type {
  ApiResponse,
  SubmissionRequest,
  SubmissionResponse,
  Stats,
  StatsQuery,
  ColorResult,
} from '@worldfeel/shared';
import { env } from '../config/env.js';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}/api${endpoint}`;

    const config: RequestInit = {
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error instanceof Error ? error : new Error('Network error');
    }
  }

  async submitWord(data: SubmissionRequest): Promise<SubmissionResponse> {
    return this.request<Stats>('/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getStats(params: StatsQuery = {}): Promise<ApiResponse<Stats>> {
    const searchParams = new URLSearchParams();

    if (params.country) searchParams.set('country', params.country);
    if (params.region) searchParams.set('region', params.region);
    if (params.city) searchParams.set('city', params.city);
    if (params.yourWord) searchParams.set('yourWord', params.yourWord);

    const query = searchParams.toString();
    const endpoint = `/stats${query ? `?${query}` : ''}`;

    return this.request<Stats>(endpoint);
  }

  async getWordColor(word: string): Promise<ApiResponse<ColorResult>> {
    const searchParams = new URLSearchParams({ word });
    return this.request<ColorResult>(`/color?${searchParams}`);
  }

  async flagContent(data: {
    word?: string;
    reason?: string;
  }): Promise<ApiResponse<void>> {
    return this.request<void>('/flag', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async healthCheck(): Promise<ApiResponse<{ timestamp: string }>> {
    return this.request<{ timestamp: string }>('/health');
  }
}

export const apiClient = new ApiClient(env.VITE_API_BASE);
export default apiClient;
