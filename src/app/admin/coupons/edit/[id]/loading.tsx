export default function LoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 shadow rounded space-y-6">
      {/* Title Skeleton */}
      <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>

      {/* Form fields skeleton */}
      {[...Array(10)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
          <div className="h-10 rounded bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
        </div>
      ))}

      {/* Button skeleton */}
      <div className="flex justify-end">
        <div className="h-10 w-32 rounded bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
      </div>
    </div>
  );
}
