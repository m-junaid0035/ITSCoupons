// components/CategoryViewSkeleton.tsx

export default function LoadingSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800 animate-pulse">
      <header className="mb-6">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
      </header>

      <section className="space-y-6">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Name</div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-64"></div>
        </div>

        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Slug</div>
          <div className="inline-block h-6 bg-gray-300 dark:bg-gray-700 rounded px-3 w-32"></div>
        </div>

        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Created At</div>
          <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-40"></div>
        </div>
      </section>
    </div>
  );
}
