import type { Creative, SummaryData, ApiResponse, DateRange } from '../types';

class ApiClient {
  private baseUrl = '';

  private async request<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(endpoint, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
      });
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Network error' } }));
      throw new Error(error.error?.message || `Request failed with status ${response.status}`);
    }

    return response.json();
  }

  async getCreatives(dateRange: DateRange): Promise<ApiResponse<Creative[]>> {
    return this.request<ApiResponse<Creative[]>>('/api/creatives', {
      since: dateRange.since,
      until: dateRange.until,
    });
  }

  async getCreative(adId: string, dateRange?: DateRange): Promise<ApiResponse<Creative>> {
    const params: Record<string, string> = {};
    if (dateRange) {
      params.since = dateRange.since;
      params.until = dateRange.until;
    }
    return this.request<ApiResponse<Creative>>(`/api/creatives/${adId}`, params);
  }

  async getSummary(dateRange: DateRange): Promise<ApiResponse<SummaryData>> {
    return this.request<ApiResponse<SummaryData>>('/api/summary', {
      since: dateRange.since,
      until: dateRange.until,
    });
  }
}

export const apiClient = new ApiClient();
