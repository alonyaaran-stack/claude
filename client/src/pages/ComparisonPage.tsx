import { Header } from '../components/layout/Header';
import { ComparisonView } from '../components/comparison/ComparisonView';
import { EmptyState } from '../components/ui/EmptyState';
import { useDateRange } from '../context/DateRangeContext';
import { useCreatives } from '../hooks/useCreatives';
import { useComparison } from '../context/ComparisonContext';
import { useNavigate } from 'react-router-dom';

export function ComparisonPage() {
  const { dateRange } = useDateRange();
  const { creatives } = useCreatives(dateRange);
  const { selectedIds, clearComparison } = useComparison();
  const navigate = useNavigate();

  const selectedCreatives = creatives.filter((c) => selectedIds.includes(c.ad_id));

  return (
    <div>
      <Header title="Compare Creatives" subtitle="Side-by-side comparison of selected creatives" />
      <div className="p-8">
        {selectedCreatives.length < 2 ? (
          <EmptyState
            title="Select creatives to compare"
            description="Go to the Creatives table and select 2-4 creatives using the checkboxes, then click Compare."
            action={{
              label: 'Go to Creatives',
              onClick: () => navigate('/creatives'),
            }}
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-400">Comparing {selectedCreatives.length} creatives</p>
              <button
                onClick={clearComparison}
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                Clear selection
              </button>
            </div>
            <ComparisonView creatives={selectedCreatives} />
          </>
        )}
      </div>
    </div>
  );
}
