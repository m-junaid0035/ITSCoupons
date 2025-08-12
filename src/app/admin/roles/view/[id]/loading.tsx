export function RoleViewPageLoadingSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800 animate-pulse">
      <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div> {/* Title */}

      <div className="space-y-6">
        {/* Name */}
        <div>
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-6 w-full max-w-md bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Display Name */}
        <div>
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-6 w-full max-w-md bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Permissions */}
        <div>
          <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
          <div className="flex flex-wrap gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded"
              />
            ))}
          </div>
        </div>

        {/* Created At */}
        <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}
