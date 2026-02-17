import { Header } from '../components/layout/Header';
import { CreativesTable } from '../components/table/CreativesTable';
import { useDateRange } from '../context/DateRangeContext';
import { useCreatives } from '../hooks/useCreatives';
import { useComparison } from '../context/ComparisonContext';
import { useNavigate } from 'react-router-dom';

export function CreativesPage() {
  const { dateRange } = useDateRange();
  const { creatives, loading } = useCreatives(dateRange);
  const { selectedIds, clearComparison } = useComparison();
  const navigate = useNavigate();

  return (
    <div>
      <Header title="Creatives" subtitle="All ad creatives with performance metrics" />
      <div className="p-8">
        {selectedIds.length >= 2 && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-blue-600/10 border border-blue-600/30 rounded-lg">
            <span className="text-sm text-blue-300">
              {selectedIds.length} creatives selected
            </span>
            <button
              onClick={() => navigate('/comparison')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
            >
              Compare Selected
            </button>
            <button
              onClick={clearComparison}
              className="px-3 py-1.5 text-gray-400 hover:text-gray-200 text-sm transition-colors"
            >
              Clear
            </button>
          </div>
        )}
        <CreativesTable creatives={creatives} loading={loading} />
      </div>
    </div>
  );
}
