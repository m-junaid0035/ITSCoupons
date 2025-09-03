// components/StaticPageViewSkeleton.tsx

export default function StaticPageViewSkeleton() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800 animate-pulse">
      <header className="mb-6">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-56"></div>
      </header>

      <section className="space-y-6">
        {/* Title */}
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Title</div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-72"></div>
        </div>

        {/* Slug */}
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Slug</div>
          <div className="inline-block h-6 bg-gray-300 dark:bg-gray-700 rounded w-40"></div>
        </div>

        {/* Content */}
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Content</div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-11/12"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-10/12"></div>
          </div>
        </div>

        {/* Status */}
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
        </div>

        {/* Created At */}
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Created At</div>
          <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
        </div>
      </section>
    </div>
  );
}
