import type { Creative } from '../../types';
import { formatCurrency, formatPercent, formatRoas } from '../../utils/formatters';
import { CreativeCardSkeleton } from '../ui/Skeleton';

interface WinningCreativesProps {
  creatives: Creative[];
  loading: boolean;
}

export function WinningCreatives({ creatives, loading }: WinningCreativesProps) {
  const winners = creatives
    .filter((c) => c.scoring.status === 'winning')
    .sort((a, b) => b.roas - a.roas)
    .slice(0, 3);

  if (loading) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Top 3 Winning Creatives</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CreativeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (winners.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Top 3 Winning Creatives</h3>
        <p className="text-sm text-gray-500">No winning creatives found in this date range.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Top 3 Winning Creatives</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {winners.map((creative, index) => (
          <div
            key={creative.ad_id}
            className="bg-gray-900 border border-green-900/50 rounded-xl p-4 relative"
          >
            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center">
              {index + 1}
            </div>
            {creative.thumbnail_url ? (
              <img
                src={creative.thumbnail_url}
                alt={creative.ad_name}
                className="w-full h-32 object-cover rounded-lg mb-3 bg-gray-800"
              />
            ) : (
              <div className="w-full h-32 bg-gray-800 rounded-lg mb-3 flex items-center justify-center text-gray-600 text-sm">
                No preview
              </div>
            )}
            <h4 className="text-sm font-medium text-gray-200 truncate mb-2">{creative.ad_name}</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-gray-500">ROAS</p>
                <p className="text-sm font-semibold text-green-400">{formatRoas(creative.roas)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">CTR</p>
                <p className="text-sm font-semibold text-gray-200">{formatPercent(creative.ctr)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Spend</p>
                <p className="text-sm font-semibold text-gray-200">{formatCurrency(creative.spend)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
