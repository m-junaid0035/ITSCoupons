"use client";

export default function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-xl w-full p-6 bg-white dark:bg-gray-800 shadow rounded space-y-6 animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>

        {/* Role Name */}
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-10 rounded bg-gray-300 dark:bg-gray-700" />
        </div>

        {/* Display Name */}
        <div className="space-y-2">
          <div className="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-10 rounded bg-gray-300 dark:bg-gray-700" />
        </div>

        {/* Permissions */}
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="h-5 w-5 rounded bg-gray-300 dark:bg-gray-700" />
                <div className="h-4 w-20 rounded bg-gray-300 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <div className="h-10 w-32 rounded bg-gray-300 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}
