"use client";

import { useState } from "react";
import {
  FaTshirt,
  FaHamburger,
  FaPlane,
  FaFilm,
  FaAppleAlt,
  FaGamepad,
  FaStore,
  FaHeartbeat,
} from "react-icons/fa";

import type { CategoryWithCounts } from "@/types/categoryWithCounts";

type FilterOption = {
  label: string;
  value: string;
};

interface CategoriesProps {
  categories: CategoryWithCounts[];
  loading?: boolean;
  error?: string | null;
}

const filterOptions: FilterOption[] = [
  { label: "All Categories", value: "all" },
  { label: "Most Popular", value: "popular" },
  { label: "Trending", value: "trending" },
];

// Map slug to icon, fallback to FaStore
const iconMap: Record<string, any> = {
  fashion: FaTshirt,
  "food & drinks": FaHamburger,
  travel: FaPlane,
  entertainment: FaFilm,
  grocery: FaAppleAlt,
  gaming: FaGamepad,
  shopping: FaStore,
  "health & beauty": FaHeartbeat,
};

export default function Categories({
  categories,
  loading = false,
  error = null,
}: CategoriesProps) {
  const [activeFilter, setActiveFilter] = useState("all");

  // Filter categories by slug groups for popular/trending
  const filteredCategories = categories.filter((cat) => {
    if (activeFilter === "all") return true;

    if (activeFilter === "popular") {
      return ["fashion", "shopping", "food & drinks"].includes(
        cat.slug.toLowerCase()
      );
    }
    if (activeFilter === "trending") {
      return ["travel", "gaming"].includes(cat.slug.toLowerCase());
    }
    return true;
  });

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">Loading categories...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        Error loading categories: {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with filters */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold">All Categories</h1>
        <div className="flex gap-2">
          {filterOptions.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                activeFilter === filter.value
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {filteredCategories.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            No categories found.
          </p>
        )}
        {filteredCategories.map((category) => {
          const Icon = iconMap[category.slug.toLowerCase()] || FaStore;

          return (
            <div
              key={category._id}
              className="border rounded-xl p-6 hover:shadow-md transition-all flex flex-col justify-between h-full"
            >
              <div className="flex flex-col items-center text-center">
                <Icon className="text-purple-600 text-3xl mb-4" />
                <h3 className="text-lg font-semibold text-purple-700 mb-2">
                  {category.name}
                </h3>
                <div className="mt-4 text-xs text-gray-400">
                  <p>{category.totalStores.toLocaleString()} Stores</p>
                  <p>{category.totalCoupons.toLocaleString()} Deals</p>
                </div>
              </div>
              <div className="mt-6 flex gap-2 justify-center">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700">
                  Browse Deals
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200">
                  View Stores
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
