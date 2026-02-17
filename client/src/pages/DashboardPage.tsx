import { Header } from '../components/layout/Header';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { WinningCreatives } from '../components/dashboard/WinningCreatives';
import { FatiguedCreatives } from '../components/dashboard/FatiguedCreatives';
import { SpendRoasChart } from '../components/dashboard/SpendRoasChart';
import { useDateRange } from '../context/DateRangeContext';
import { useSummary } from '../hooks/useSummary';
import { useCreatives } from '../hooks/useCreatives';
import { EmptyState } from '../components/ui/EmptyState';

export function DashboardPage() {
  const { dateRange } = useDateRange();
  const { summary, loading: summaryLoading, error: summaryError } = useSummary(dateRange);
  const { creatives, loading: creativesLoading, error: creativesError } = useCreatives(dateRange);

  const loading = summaryLoading || creativesLoading;
  const error = summaryError || creativesError;

  return (
    <div>
      <Header title="Dashboard" subtitle="Overview of your Meta ad creative performance" />
      <div className="p-8 space-y-8">
        <SummaryCards summary={summary} loading={loading} />

        {!loading && !error && creatives.length === 0 ? (
          <EmptyState
            title="No creatives found"
            description="No ad creatives were found for the selected date range. Try adjusting the date range or check that your Meta account has active ads."
          />
        ) : (
          <>
            <WinningCreatives creatives={creatives} loading={loading} />
            <FatiguedCreatives creatives={creatives} loading={loading} />
            <SpendRoasChart creatives={creatives} loading={loading} />
          </>
        )}
      </div>
    </div>
  );
}
