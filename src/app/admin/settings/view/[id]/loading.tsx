export default function SettingsLoading() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg animate-pulse dark:bg-gray-800">
      <div className="h-8 w-48 bg-gray-300 rounded mb-6 dark:bg-gray-700"></div>

      {[...Array(10)].map((_, i) => (
        <div key={i} className="mb-6">
          <div className="h-4 w-32 bg-gray-300 rounded mb-2 dark:bg-gray-700"></div>
          <div className="h-6 w-full max-w-md bg-gray-300 rounded dark:bg-gray-700"></div>
        </div>
      ))}
    </div>
  );
}
