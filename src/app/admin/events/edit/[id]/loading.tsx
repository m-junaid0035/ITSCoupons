"use client";

import React from "react";

export default function LoadingSkeleton() {
  return (
    <div className="w-full p-6 bg-white dark:bg-gray-800 shadow rounded space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Title Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Slug Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Date Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Description Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-28 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Image URL Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Meta Title Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Meta Description Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-36 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-16 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Meta Keywords Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-36 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Focus Keywords Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-36 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Description Modal Button Skeleton */}
      <div className="h-10 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>

      {/* Submit Button Skeleton */}
      <div className="flex justify-end pt-4">
        <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}
