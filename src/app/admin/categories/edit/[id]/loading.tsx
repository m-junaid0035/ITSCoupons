// loading.tsx
export default function LoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto p-4 bg-white dark:bg-gray-800 rounded shadow animate-pulse">
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-6"></div>
      <div className="space-y-4">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
      </div>
      <div className="mt-8 h-10 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
    </div>
  );
}
