"use client";

export default function LoadingSkeleton() {
  return (
    <div className="w-full min-h-screen shadow-lg bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 animate-pulse rounded-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="h-6 sm:h-8 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Store Name */}
      <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>

      {/* Image */}
      <div className="h-40 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>

      {/* Direct URL */}
      <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>

      {/* Network Dropdown */}
      <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>

      {/* Network URL (conditional) */}
      <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>

      {/* Categories */}
      <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>

      {/* Description editor */}
      <div className="h-40 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>

      {/* Content editor */}
      <div className="h-60 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>

      {/* SEO Modal trigger */}
      <div className="h-10 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>

      {/* Popular & Active checkboxes */}
      <div className="flex space-x-6">
        <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Slug */}
      <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>

      {/* Submit button */}
      <div className="h-10 w-40 bg-gray-300 dark:bg-gray-700 rounded ml-auto"></div>
    </div>
  );
}
