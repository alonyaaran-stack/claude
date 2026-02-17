interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-800 rounded ${className}`} />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-8 w-32" />
    </div>
  );
}

export function CreativeCardSkeleton() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <Skeleton className="h-40 w-full mb-3 rounded-lg" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-gray-800">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
