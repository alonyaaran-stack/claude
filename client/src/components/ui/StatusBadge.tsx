import type { CreativeScoring } from '../../types';

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  winning: { bg: 'bg-green-950', text: 'text-green-400', dot: 'bg-green-400' },
  watch: { bg: 'bg-yellow-950', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  fatigued: { bg: 'bg-red-950', text: 'text-red-400', dot: 'bg-red-400' },
  low_spend: { bg: 'bg-gray-800', text: 'text-gray-400', dot: 'bg-gray-500' },
};

interface StatusBadgeProps {
  scoring: CreativeScoring;
}

export function StatusBadge({ scoring }: StatusBadgeProps) {
  const style = statusStyles[scoring.status] || statusStyles.low_spend!;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {scoring.label}
    </span>
  );
}
