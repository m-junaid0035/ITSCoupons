export default function LoadingSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800 animate-pulse">
      <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div> {/* Title */}

      <div className="space-y-6">
        {/* Name */}
        <div>
          <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-6 w-full max-w-md bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Email */}
        <div>
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-6 w-full max-w-md bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Role */}
        <div>
          <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Status */}
        <div>
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Created At */}
        <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}
