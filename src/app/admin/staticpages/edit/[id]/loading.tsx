// components/StaticPageFormSkeleton.tsx

export default function StaticPageFormSkeleton() {
  return (
    <div className="w-full shadow-lg bg-white dark:bg-gray-800 pt-4 animate-pulse rounded-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 gap-3">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-40"></div>
        <div className="h-9 w-28 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      <div className="p-6 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 w-24 rounded"></div>
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 w-16 rounded"></div>
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 w-20 rounded"></div>
          <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        </div>

        {/* Published Toggle */}
        <div className="flex items-center space-x-3">
          <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 w-24 rounded"></div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}
