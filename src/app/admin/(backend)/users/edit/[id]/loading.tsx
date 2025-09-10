"use client";

export default function EditUserFormLoadingSkeleton() {
  return (
    <div className="w-full shadow-lg bg-white dark:bg-gray-800 p-6 animate-pulse rounded-md">
      {/* Title placeholder */}
      <div className="h-8 w-40 bg-gray-300 dark:bg-gray-600 rounded mb-8"></div>

      {/* Name input */}
      <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>

      {/* Email input */}
      <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>

      {/* Role select */}
      <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>

      {/* Image upload */}
      <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>

      {/* Switches container */}
      <div className="flex space-x-8 mb-6">
        {/* isActive switch */}
        <div className="h-6 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
        {/* You can add more switches here if needed */}
      </div>

      {/* Submit button */}
      <div className="h-10 w-32 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
    </div>
  );
}
