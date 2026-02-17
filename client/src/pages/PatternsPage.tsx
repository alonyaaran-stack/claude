import { Header } from '../components/layout/Header';
import { WinningPatterns } from '../components/patterns/WinningPatterns';
import { useDateRange } from '../context/DateRangeContext';
import { useSummary } from '../hooks/useSummary';

export function PatternsPage() {
  const { dateRange } = useDateRange();
  const { summary, loading } = useSummary(dateRange);

  return (
    <div>
      <Header title="Winning Patterns" subtitle="Insights from your top-performing creatives" />
      <div className="p-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-1">What makes your best ads work?</h3>
          <p className="text-sm text-gray-500">
            Analysis of the top 20% of creatives by ROAS to surface common patterns and insights.
          </p>
        </div>
        <WinningPatterns patterns={summary?.patterns || []} loading={loading} />
      </div>
    </div>
  );
}
