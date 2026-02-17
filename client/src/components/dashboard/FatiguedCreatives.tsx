import type { Creative } from '../../types';
import { formatPercent, formatCurrency } from '../../utils/formatters';
import { CreativeCardSkeleton } from '../ui/Skeleton';

interface FatiguedCreativesProps {
  creatives: Creative[];
  loading: boolean;
}

export function FatiguedCreatives({ creatives, loading }: FatiguedCreativesProps) {
  const fatigued = creatives.filter((c) => c.scoring.status === 'fatigued');

  if (loading) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <span className="text-amber-400">Warning:</span> Fatigued Creatives
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <CreativeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (fatigued.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <span className="text-amber-400">Warning:</span> Fatigued Creatives
        </h3>
        <p className="text-sm text-gray-500">No fatigued creatives detected. All creatives are performing within healthy frequency ranges.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
        <span className="text-amber-400">Warning:</span> Fatigued Creatives
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fatigued.map((creative) => (
          <div
            key={creative.ad_id}
            className="bg-gray-900 border border-red-900/50 rounded-xl p-4 flex gap-4"
          >
            {creative.thumbnail_url ? (
              <img
                src={creative.thumbnail_url}
                alt={creative.ad_name}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0 bg-gray-800"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-800 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-600 text-xs">
                No preview
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-200 truncate">{creative.ad_name}</h4>
              <div className="flex gap-4 mt-2">
                <div>
                  <p className="text-xs text-gray-500">Frequency</p>
                  <p className="text-sm font-semibold text-red-400">{creative.frequency.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">CTR</p>
                  <p className="text-sm font-semibold text-red-400">{formatPercent(creative.ctr)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Spend</p>
                  <p className="text-sm font-semibold text-gray-300">{formatCurrency(creative.spend)}</p>
                </div>
              </div>
              <p className="text-xs text-red-400/70 mt-2">
                High frequency ({creative.frequency.toFixed(1)}) with declining CTR
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
