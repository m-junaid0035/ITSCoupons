"use client";

export default function LoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Content Sections */}
      <section className="space-y-6">
        {/* Title */}
        <div>
          <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-6 w-60 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Slug */}
        <div>
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded mb-1"></div>
          <div className="inline-block h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Date */}
        <div>
          <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded mb-1"></div>
          <div className="inline-block h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Description */}
        <div>
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-1"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>

        {/* Image */}
        <div>
          <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
          <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-700"></div>
        </div>

        {/* Meta Title */}
        <div>
          <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Meta Description */}
        <div>
          <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-4/5 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Meta Keywords */}
        <div>
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
          <div className="flex flex-wrap gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>

        {/* Focus Keywords */}
        <div>
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>

        {/* Created At */}
        <div className="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </section>
    </div>
  );
}
