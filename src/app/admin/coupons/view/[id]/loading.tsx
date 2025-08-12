"use client";

export default function LoadingSkeleton() {
  const base = "bg-gray-200 dark:bg-gray-700 rounded animate-pulse";

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        <div className={`${base} h-8 w-48`}></div>
      </h2>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Title</p>
          <div className={`${base} h-6 w-3/4 mt-1`}></div>
        </div>

        {/* Coupon Code */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Coupon Code</p>
          <div className={`${base} h-6 w-1/2 mt-1`}></div>
        </div>

        {/* Coupon Type */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Coupon Type</p>
          <div className={`${base} inline-block h-6 w-20 mt-1 rounded-full`}></div>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
          <div className={`${base} inline-block h-6 w-20 mt-1 rounded-full`}></div>
        </div>

        {/* Top One */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Top One</p>
          <div className={`${base} inline-block h-6 w-14 mt-1 rounded-full`}></div>
        </div>

        {/* Store Name */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Store Name</p>
          <div className={`${base} h-6 w-1/2 mt-1`}></div>
        </div>

        {/* Store ID */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Store ID</p>
          <div className={`${base} h-6 w-1/3 mt-1`}></div>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
          <div className={`${base} h-16 w-full mt-1 rounded`}></div>
        </div>

        {/* Coupon URL */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Coupon URL</p>
          <div className={`${base} h-6 w-3/4 mt-1`}></div>
        </div>

        {/* Expiration Date */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Expiration Date</p>
          <div className={`${base} h-6 w-1/3 mt-1`}></div>
        </div>

        {/* Created At */}
        <div>
          <div className={`${base} h-4 w-40 mt-4 ml-auto`}></div>
        </div>
      </div>
    </div>
  );
}
