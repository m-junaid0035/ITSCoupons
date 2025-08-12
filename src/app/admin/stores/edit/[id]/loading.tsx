"use client";

export default function LoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto shadow-lg bg-white p-6 animate-pulse rounded-md">
      <div className="h-8 w-40 bg-gray-300 rounded mb-8"></div> {/* Title */}

      {/* Simulate form fields */}
      {[...Array(12)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-300 rounded mb-6"></div>
      ))}

      {/* Simulate checkboxes group */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={`checkbox-${i}`}
            className="flex items-center space-x-2"
          >
            <div className="h-4 w-4 bg-gray-300 rounded" />
            <div className="h-4 w-20 bg-gray-300 rounded" />
          </div>
        ))}
      </div>

      {/* Submit button */}
      <div className="h-10 w-32 bg-gray-300 rounded mx-auto"></div>
    </div>
  );
}
