export default function LoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 shadow rounded space-y-6">
      {/* Card Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>

      {/* Form Fields Skeleton */}
      {[...Array(10)].map((_, i) => (
        <div key={i} className="space-y-2">
          {/* Label Skeleton */}
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
          {/* Input/Textarea Skeleton */}
          <div className={`h-${i === 1 ? "20" : "10"} rounded bg-gray-300 dark:bg-gray-700 animate-pulse`}></div>
        </div>
      ))}

      {/* Calendar / Date Picker Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
        <div className="h-10 w-full rounded bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
      </div>

      {/* Description Editor Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-36 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
        <div className="h-24 w-full rounded bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
      </div>

      {/* Checkbox / Toggle Skeleton */}
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 rounded bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>

      {/* Button Skeleton */}
      <div className="flex justify-end mt-4">
        <div className="h-10 w-32 rounded bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
      </div>
    </div>
  );
}
