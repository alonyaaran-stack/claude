import { Skeleton } from './Skeleton';

interface StatCardProps {
  label: string;
  value: string;
  loading?: boolean;
}

export function StatCard({ label, value, loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-gray-100">{value}</p>
    </div>
  );
}
