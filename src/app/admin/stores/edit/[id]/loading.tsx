"use client";

export default function LoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 p-6 animate-pulse rounded-md space-y-6">
      {/* Title */}
      <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>

      {/* Network Name Dropdown */}
      <div className="h-10 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>

      {/* Conditional Store Network URL */}
      <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>

      {/* Image preview */}
      <div className="h-40 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>

      {/* Text Inputs */}
      {[...Array(7)].map((_, i) => (
        <div key={`input-${i}`} className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
      ))}

      {/* Textareas */}
      {[...Array(3)].map((_, i) => (
        <div key={`textarea-${i}`} className="h-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
      ))}

      {/* Categories / Checkboxes */}
      <div className="grid grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={`checkbox-${i}`} className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>

      {/* Checkboxes for Is Popular / Is Active */}
      <div className="flex space-x-6">
        <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Submit button */}
      <div className="h-10 w-40 bg-gray-300 dark:bg-gray-700 rounded mx-auto mt-4"></div>
    </div>
  );
}
