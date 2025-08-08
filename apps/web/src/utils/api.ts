import type {
  ApiResponse,
  SubmissionRequest,
  SubmissionResponse,
  Stats,
  StatsQuery,
  ColorResult,
  SubmitStatus,
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

  async getSubmitStatus(
    params: {
      deviceId?: string;
    } = {}
  ): Promise<ApiResponse<SubmitStatus>> {
    const sp = new URLSearchParams();
    if (params.deviceId) sp.set('deviceId', params.deviceId);
    const qs = sp.toString();
    return this.request(`/submit/status${qs ? `?${qs}` : ''}`);
  }

  async getStats(params: StatsQuery = {}): Promise<ApiResponse<Stats>> {
    const searchParams = new URLSearchParams();

    if (params.yourWord) searchParams.set('yourWord', params.yourWord);
    if ((params as any).deviceId)
      searchParams.set('deviceId', String((params as any).deviceId));

    const query = searchParams.toString();
    const endpoint = `/stats${query ? `?${query}` : ''}`;

    return this.request<Stats>(endpoint);
  }

  async getWordColor(word: string): Promise<ApiResponse<ColorResult>> {
    const searchParams = new URLSearchParams({ word });
    return this.request<ColorResult>(`/color?${searchParams}`);
  }

  async searchEmotions(
    query: string,
    limit: number = 20
  ): Promise<ApiResponse<string[]>> {
    const params = new URLSearchParams();
    params.set('q', query);
    if (limit) params.set('limit', String(limit));
    return this.request<string[]>(`/emotions/search?${params.toString()}`);
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
