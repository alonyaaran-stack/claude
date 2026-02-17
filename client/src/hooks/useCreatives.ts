import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import type { Creative, DateRange } from '../types';
import toast from 'react-hot-toast';

export function useCreatives(dateRange: DateRange) {
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.getCreatives(dateRange);
        if (!cancelled) {
          setCreatives(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to fetch creatives';
          setError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [dateRange.since, dateRange.until]);

  return { creatives, loading, error };
}
