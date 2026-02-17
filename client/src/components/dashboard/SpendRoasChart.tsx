import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Creative } from '../../types';
import { Skeleton } from '../ui/Skeleton';

interface SpendRoasChartProps {
  creatives: Creative[];
  loading: boolean;
}

export function SpendRoasChart({ creatives, loading }: SpendRoasChartProps) {
  if (loading) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Spend vs ROAS</h3>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  const data = creatives
    .filter((c) => c.spend > 0)
    .map((c) => ({
      name: c.ad_name,
      spend: c.spend,
      roas: c.roas,
      status: c.scoring.status,
    }));

  if (data.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Spend vs ROAS</h3>
        <p className="text-sm text-gray-500">No data available for chart.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Spend vs ROAS</h3>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="spend"
              name="Spend"
              unit="$"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              axisLine={{ stroke: '#4b5563' }}
            />
            <YAxis
              dataKey="roas"
              name="ROAS"
              unit="x"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              axisLine={{ stroke: '#4b5563' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#f3f4f6',
              }}
              formatter={(value: number, name: string) => {
                if (name === 'Spend') return [`$${value.toFixed(2)}`, name];
                if (name === 'ROAS') return [`${value.toFixed(2)}x`, name];
                return [value, name];
              }}
            />
            <Scatter data={data} fill="#3b82f6" fillOpacity={0.7} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
