"use client";

export default function StoreViewPageLoading() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800 animate-pulse space-y-6">
      {/* Title */}
      <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>

      <div className="space-y-6">
        {/* Store Image */}
        <div>
          <p className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-2"></p>
          <div className="h-48 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Store Name */}
        <div>
          <p className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-1"></p>
          <div className="h-6 w-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Network Name */}
        <div>
          <p className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-1"></p>
          <div className="h-6 w-56 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Store Network URL */}
        <div>
          <p className="h-4 w-36 bg-gray-300 dark:bg-gray-700 rounded mb-1"></p>
          <div className="h-6 w-72 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Categories */}
        <div>
          <p className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded mb-1"></p>
          <div className="flex gap-2 flex-wrap">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>

        {/* Slug */}
        <div>
          <p className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded mb-1"></p>
          <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Total Coupon Used Times */}
        <div>
          <p className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-1"></p>
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Description */}
        <div>
          <p className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-1"></p>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>

        {/* Meta Title */}
        <div>
          <p className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded mb-1"></p>
          <div className="h-6 w-56 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Meta Description */}
        <div>
          <p className="h-4 w-36 bg-gray-300 dark:bg-gray-700 rounded mb-1"></p>
          <div className="h-6 w-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Meta Keywords */}
        <div>
          <p className="h-4 w-36 bg-gray-300 dark:bg-gray-700 rounded mb-1"></p>
          <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Focus Keywords */}
        <div>
          <p className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-1"></p>
          <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Popular */}
        <div>
          <p className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded mb-1"></p>
          <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Status */}
        <div>
          <p className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded mb-1"></p>
          <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Created At */}
        <div>
          <div className="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded mt-4"></div>
        </div>
      </div>
    </div>
  );
}
