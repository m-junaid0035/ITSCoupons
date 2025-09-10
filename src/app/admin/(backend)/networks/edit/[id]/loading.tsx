// loadingNetwork.tsx
export default function LoadingNetworkSkeleton() {
  return (
    <div className="w-full p-6 bg-white dark:bg-gray-800 rounded shadow animate-pulse space-y-6">
      {/* Header */}
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>

      {/* Network Name Input */}
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>

      {/* Network URL Input */}
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>

      {/* Checkboxes (optional if you have any boolean fields) */}
      <div className="flex space-x-4 mt-4">
        <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>

      {/* Buttons */}
      <div className="mt-6 h-10 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
    </div>
  );
}
