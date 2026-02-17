import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import type { SummaryData, DateRange } from '../types';
import toast from 'react-hot-toast';

export function useSummary(dateRange: DateRange) {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.getSummary(dateRange);
        if (!cancelled) {
          setSummary(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to fetch summary';
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

  return { summary, loading, error };
}
