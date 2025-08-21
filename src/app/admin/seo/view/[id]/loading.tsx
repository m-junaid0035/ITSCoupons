export default function SEOLoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 p-6 space-y-6 animate-pulse">
      {/* Header */}
      <div className="h-6 w-48 bg-gray-300 rounded dark:bg-gray-600"></div>

      {/* SEO fields skeleton */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-32 bg-gray-300 rounded dark:bg-gray-600"></div> {/* Label */}
          <div className="h-10 bg-gray-300 rounded dark:bg-gray-600"></div> {/* Input/Text display */}
        </div>
      ))}

      {/* Meta Keywords / Focus Keywords textarea skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-32 bg-gray-300 rounded dark:bg-gray-600"></div>
        <div className="h-20 bg-gray-300 rounded dark:bg-gray-600"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-32 bg-gray-300 rounded dark:bg-gray-600"></div>
        <div className="h-20 bg-gray-300 rounded dark:bg-gray-600"></div>
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <div className="h-4 w-32 bg-gray-300 rounded dark:bg-gray-600"></div>
        <div className="h-10 bg-gray-300 rounded dark:bg-gray-600"></div>
      </div>

      {/* Created / Updated At */}
      {[...Array(2)].map((_, i) => (
        <div key={i} className="h-4 w-48 bg-gray-300 rounded dark:bg-gray-600"></div>
      ))}
    </div>
  );
}
