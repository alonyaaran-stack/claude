import type { Creative } from '../../types';
import { formatCurrency, formatPercent, formatRoas, formatNumber, formatCta } from '../../utils/formatters';

interface ComparisonViewProps {
  creatives: Creative[];
}

interface MetricRow {
  label: string;
  getValue: (c: Creative) => number;
  format: (v: number) => string;
  higherIsBetter: boolean;
}

const metrics: MetricRow[] = [
  { label: 'Spend', getValue: (c) => c.spend, format: formatCurrency, higherIsBetter: false },
  { label: 'Impressions', getValue: (c) => c.impressions, format: formatNumber, higherIsBetter: true },
  { label: 'Clicks', getValue: (c) => c.clicks, format: formatNumber, higherIsBetter: true },
  { label: 'CTR', getValue: (c) => c.ctr, format: formatPercent, higherIsBetter: true },
  { label: 'CPC', getValue: (c) => c.cpc, format: formatCurrency, higherIsBetter: false },
  { label: 'ROAS', getValue: (c) => c.roas, format: formatRoas, higherIsBetter: true },
  { label: 'Frequency', getValue: (c) => c.frequency, format: (v) => v.toFixed(1), higherIsBetter: false },
  { label: 'Reach', getValue: (c) => c.reach, format: formatNumber, higherIsBetter: true },
];

export function ComparisonView({ creatives }: ComparisonViewProps) {
  const getBestIndex = (metric: MetricRow) => {
    const values = creatives.map((c) => metric.getValue(c));
    if (metric.higherIsBetter) {
      return values.indexOf(Math.max(...values));
    }
    // For "lower is better" metrics, find the lowest non-zero value
    const nonZero = values.filter((v) => v > 0);
    if (nonZero.length === 0) return -1;
    const best = Math.min(...nonZero);
    return values.indexOf(best);
  };

  return (
    <div className="space-y-6">
      {/* Creative cards */}
      <div className={`grid gap-4 ${creatives.length <= 2 ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-' + creatives.length}`}>
        {creatives.map((creative) => (
          <div key={creative.ad_id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            {creative.thumbnail_url ? (
              <img
                src={creative.thumbnail_url}
                alt={creative.ad_name}
                className="w-full h-40 object-cover rounded-lg mb-3 bg-gray-800"
              />
            ) : (
              <div className="w-full h-40 bg-gray-800 rounded-lg mb-3 flex items-center justify-center text-gray-600">
                No preview
              </div>
            )}
            <h4 className="text-sm font-medium text-gray-200 truncate">{creative.ad_name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500 capitalize">{creative.object_type?.toLowerCase()}</span>
              {creative.call_to_action_type && (
                <>
                  <span className="text-gray-700">|</span>
                  <span className="text-xs text-gray-500">{formatCta(creative.call_to_action_type)}</span>
                </>
              )}
            </div>
            {(creative.title || creative.body) && (
              <div className="mt-3 p-2 bg-gray-800/50 rounded-lg">
                {creative.title && (
                  <p className="text-xs font-medium text-gray-300">{creative.title}</p>
                )}
                {creative.body && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-3">{creative.body}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Metrics comparison table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
              {creatives.map((c) => (
                <th key={c.ad_id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase truncate max-w-[150px]">
                  {c.ad_name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => {
              const bestIdx = getBestIndex(metric);
              return (
                <tr key={metric.label} className="border-b border-gray-800/50">
                  <td className="px-4 py-3 text-gray-400">{metric.label}</td>
                  {creatives.map((c, idx) => (
                    <td
                      key={c.ad_id}
                      className={`px-4 py-3 font-medium ${
                        idx === bestIdx ? 'text-green-400' : 'text-gray-300'
                      }`}
                    >
                      {metric.format(metric.getValue(c))}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
