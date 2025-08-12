export default function LoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 p-6 space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 w-48 bg-gray-300 rounded dark:bg-gray-600"></div>
        <div className="h-8 w-24 bg-gray-300 rounded dark:bg-gray-600"></div>
      </div>

      {/* Form fields skeleton */}
      {[...Array(12)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-32 bg-gray-300 rounded dark:bg-gray-600"></div> {/* Label */}
          <div className="h-10 bg-gray-300 rounded dark:bg-gray-600"></div> {/* Input */}
        </div>
      ))}

      {/* For textareas, make a bigger block */}
      {/* Let's replace some with textarea skeletons */}
      <div className="space-y-2">
        <div className="h-4 w-32 bg-gray-300 rounded dark:bg-gray-600"></div>
        <div className="h-20 bg-gray-300 rounded dark:bg-gray-600"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-32 bg-gray-300 rounded dark:bg-gray-600"></div>
        <div className="h-28 bg-gray-300 rounded dark:bg-gray-600"></div>
      </div>

      {/* Social links grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-32 bg-gray-300 rounded dark:bg-gray-600"></div>
            <div className="h-10 bg-gray-300 rounded dark:bg-gray-600"></div>
          </div>
        ))}
      </div>

      {/* Submit button */}
      <div className="flex justify-end mt-6">
        <div className="h-10 w-32 bg-gray-300 rounded dark:bg-gray-600"></div>
      </div>
    </div>
  );
}
