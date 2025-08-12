export default function LoadingSkeleton() {
  const skeletonClass = "animate-pulse bg-gray-300 dark:bg-gray-700 rounded";

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        <span className={`${skeletonClass} h-8 w-48 inline-block`}>&nbsp;</span>
      </h2>

      <div className="space-y-6">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className={`${skeletonClass} h-4 w-24 inline-block`}>&nbsp;</span>
            </p>
            <p className={`${skeletonClass} h-6 w-full max-w-md`}></p>
          </div>
        ))}

        <div className="h-48 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}
