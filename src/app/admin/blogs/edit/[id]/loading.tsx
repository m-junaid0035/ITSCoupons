"use client";

import React from "react";

export default function LoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 pt-4 animate-pulse space-y-6 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-none px-6 py-4">
        <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-8 w-28 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6 max-w-2xl mx-auto px-6 pb-6">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Writer */}
        <div className="space-y-2">
          <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Date Picker */}
        <div className="space-y-2">
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-10 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Description (Modal trigger placeholder) */}
        <div className="space-y-2">
          <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-10 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Meta Title */}
        <div className="space-y-2">
          <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <div className="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-20 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Meta Keywords */}
        <div className="space-y-2">
          <div className="h-4 w-44 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Focus Keywords */}
        <div className="space-y-2">
          <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <div className="h-10 w-36 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}
