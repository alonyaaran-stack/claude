import type { WinningPattern } from '../../types';
import { Skeleton } from '../ui/Skeleton';

interface WinningPatternsProps {
  patterns: WinningPattern[];
  loading: boolean;
}

const categoryIcons: Record<string, string> = {
  format: '\uD83C\uDFAC',
  cta: '\uD83D\uDCE3',
  copy: '\u270D\uFE0F',
  frequency: '\uD83D\uDD04',
};

const categoryColors: Record<string, string> = {
  format: 'border-purple-900/50 bg-purple-950/30',
  cta: 'border-blue-900/50 bg-blue-950/30',
  copy: 'border-amber-900/50 bg-amber-950/30',
  frequency: 'border-emerald-900/50 bg-emerald-950/30',
};

export function WinningPatterns({ patterns, loading }: WinningPatternsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <Skeleton className="h-5 w-40 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (patterns.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
        <p className="text-gray-400">Not enough data to identify winning patterns. Need at least 5 creatives with spend data.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {patterns.map((pattern, idx) => (
        <div
          key={idx}
          className={`border rounded-xl p-6 ${categoryColors[pattern.category] || 'border-gray-800 bg-gray-900'}`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{categoryIcons[pattern.category] || '\uD83C\uDFC6'}</span>
            <h4 className="text-sm font-semibold text-gray-200">{pattern.title}</h4>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">{pattern.description}</p>
        </div>
      ))}
    </div>
  );
}
