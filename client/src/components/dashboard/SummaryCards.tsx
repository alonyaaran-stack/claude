import { StatCard } from '../ui/StatCard';
import type { SummaryData } from '../../types';
import { formatCurrency, formatPercent, formatRoas } from '../../utils/formatters';

interface SummaryCardsProps {
  summary: SummaryData | null;
  loading: boolean;
}

export function SummaryCards({ summary, loading }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Spend"
        value={summary ? formatCurrency(summary.totalSpend) : '-'}
        loading={loading}
      />
      <StatCard
        label="Avg CTR"
        value={summary ? formatPercent(summary.avgCtr) : '-'}
        loading={loading}
      />
      <StatCard
        label="Avg ROAS"
        value={summary ? formatRoas(summary.avgRoas) : '-'}
        loading={loading}
      />
      <StatCard
        label="Avg CPC"
        value={summary ? formatCurrency(summary.avgCpc) : '-'}
        loading={loading}
      />
    </div>
  );
}
