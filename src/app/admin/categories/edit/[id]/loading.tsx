// loading.tsx
export default function LoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow animate-pulse space-y-6">
      {/* Header */}
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>

      {/* Input fields */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
      </div>

      {/* Checkboxes */}
      <div className="flex space-x-4 mt-4">
        <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>

      {/* Textarea */}
      <div className="h-20 bg-gray-300 dark:bg-gray-600 rounded mt-4"></div>

      {/* Button */}
      <div className="mt-6 h-10 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
    </div>
  );
}
