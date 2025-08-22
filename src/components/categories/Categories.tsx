"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaStore } from "react-icons/fa";

import type { CategoryWithCounts } from "@/types/categoryWithCounts";

type FilterOption = {
  label: string;
  value: "all" | "popular" | "trending";
};

interface CategoriesProps {
  categories: CategoryWithCounts[];
  error?: string | null;
}

const filterOptions: FilterOption[] = [
  { label: "All Categories", value: "all" },
  { label: "Most Popular", value: "popular" },
  { label: "Trending", value: "trending" },
];

export default function Categories({
  categories,
  error = null,
}: CategoriesProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "popular" | "trending">("all");
  const router = useRouter();

  const filteredCategories = categories.filter((cat) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "popular") return cat.isPopular === true;
    if (activeFilter === "trending") return cat.isTrending === true;
    return true;
  });

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        Error loading categories: {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header with filters */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-bold">All Categories</h1>
        <div className="flex gap-2">
          {filterOptions.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${activeFilter === filter.value
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            No categories found.
          </p>
        )}
        {filteredCategories.map((category) => (
          <div
            key={category._id}
            className="border rounded-xl p-8 min-h-[320px] hover:shadow-lg transition-all flex flex-col justify-between h-full"
          >
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <FaStore className="text-purple-600 text-4xl mb-4" />

              {/* Title */}
              <h3 className="text-xl font-semibold text-purple-700 mb-3">
                {category.name}
              </h3>

              {/* Description */}
              {category.description && (
                <div
                  className="text-sm text-gray-500 line-clamp-3 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: category.description }}
                />
              )}
            </div>

            {/* Bottom row counts */}
            <div className="mt-6 flex justify-between items-center text-sm font-medium text-gray-700">
              <span>{category.totalStores}+ Stores</span>
              <span>{category.totalCoupons}+ Coupons</span>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center w-full">
              <button
                className="bg-purple-600 text-white px-5 py-2 rounded-md text-sm hover:bg-purple-700 w-full sm:w-auto"
                onClick={() =>
                  router.push(`/coupons?category=${category.slug}`)
                }
              >
                Browse Deals
              </button>
              <button
                className="bg-gray-100 text-gray-700 px-5 py-2 rounded-md text-sm hover:bg-gray-200 w-full sm:w-auto"
                onClick={() =>
                  router.push(`/stores?category=${category.slug}`)
                }
              >
                View Stores
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
