export default function LoadingSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 shadow rounded space-y-6">
      {/* Title Skeleton */}
      <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>

      {/* Slug Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
        <div className="h-10 rounded bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
      </div>

      {/* Date Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
        <div className="h-10 rounded bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
      </div>

      {/* Description Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
        <div className="h-24 rounded bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
      </div>

      {/* Image URL Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
        <div className="h-10 rounded bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
      </div>

      {/* Meta Title Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
        <div className="h-10 rounded bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
      </div>

      {/* Meta Description Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-36 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
        <div className="h-16 rounded bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
      </div>

      {/* Meta Keywords Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-36 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
        <div className="h-10 rounded bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
      </div>

      {/* Focus Keywords Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-36 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
        <div className="h-10 rounded bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
      </div>

      {/* Submit Button Skeleton */}
      <div className="flex justify-end">
        <div className="h-10 w-32 rounded bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
      </div>
    </div>
  );
}
