"use client";

import { Check, Tag } from "lucide-react";
import type { CategoryData } from "@/types/category";

interface CategoriesSearchProps {
  categories: CategoryData[];
  onSelectCategory: (categoryId: string) => void;
}

export default function CategoriesSearch({ categories, onSelectCategory }: CategoriesSearchProps) {
  return (
    <section className="bg-purple-800 text-white py-20 px-4 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse by Categories</h1>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        Discover Amazing Deals and Exclusive Coupons by Your Favorite Categories
      </h2>

      <p className="max-w-2xl mx-auto text-base md:text-lg mb-8">
        Explore categories to find the best discounts, promo codes, and deals tailored for each type of product or service.
      </p>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto mb-6">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => onSelectCategory(cat._id)}
            className="flex items-center gap-2 bg-white text-purple-800 font-semibold px-4 py-2 rounded-md hover:bg-purple-100 hover:text-purple-900 transition"
          >
            <Tag className="w-5 h-5" />
            {cat.name}
          </button>
        ))}
      </div>

      {/* Highlights */}
      <div className="flex flex-wrap justify-center gap-6 text-sm font-medium mt-4">
        <div className="flex items-center gap-1">
          <Check className="w-4 h-4 text-white" />
          <span>Verified Stores</span>
        </div>
        <div className="flex items-center gap-1">
          <Check className="w-4 h-4 text-white" />
          <span>1000+ Stores</span>
        </div>
        <div className="flex items-center gap-1">
          <Check className="w-4 h-4 text-white" />
          <span>Daily Updates</span>
        </div>
      </div>
    </section>
  );
}
