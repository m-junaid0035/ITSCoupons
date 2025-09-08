export default function Loading() {
  return (
    <div className="p-6 space-y-6 animate-pulse" aria-busy="true">
      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="bg-gray-200 h-24 rounded shadow p-4 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>

      {/* Monthly Trends Skeleton */}
      <div className="bg-gray-200 h-64 md:h-72 rounded shadow"></div>

      {/* Coupon Status, Type & Store Status Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="bg-gray-200 h-64 rounded shadow"></div>
        ))}
      </div>

      {/* Top Stores Skeleton */}
      <div className="bg-gray-200 h-64 rounded shadow"></div>
    </div>
  );
}
