"use client";

export default function LoadingSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 animate-pulse p-6 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>

      {/* Title Section */}
      <div className="space-y-3">
        <div className="h-8 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-6 w-1/4 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>

      {/* Content Blocks */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-1/5 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      ))}

      {/* Permissions Grid */}
      <div className="space-y-3">
        <div className="h-4 w-1/5 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded bg-gray-300 dark:bg-gray-700" />
              <div className="h-4 w-24 rounded bg-gray-300 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end mt-auto">
        <div className="h-10 w-32 rounded bg-gray-300 dark:bg-gray-700" />
      </div>
    </div>
  );
}
