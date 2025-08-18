"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import type { StoreData } from "@/types/store";

interface DiscoverStoresProps {
  stores: StoreData[];
}

export default function DiscoverStores({ stores }: DiscoverStoresProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Filter stores based on search term
  const filteredStores = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return stores.filter((store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, stores]);

  const handleSelectStore = (storeId: string) => {
    setSearchTerm("");
    router.push(`/stores/${storeId}`);
  };

  return (
    <section className="bg-purple-800 text-white py-20 px-4 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        Discover Amazing Stores
      </h1>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        Save with Every Purchase
      </h2>

      <p className="max-w-2xl mx-auto text-base md:text-lg mb-8">
        Browse through thousands of verified stores and discover exclusive deals,
        coupons, and discounts from your favorite brands. Start saving money today!
      </p>

      {/* Search bar */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-3 max-w-xl mx-auto mb-6 relative">
        <div className="relative w-full md:w-[400px]">
          <input
            type="text"
            placeholder="Search for stores, brands, or categories..."
            className="bg-white w-full px-4 py-3 rounded-md text-black placeholder-gray-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Dropdown of filtered stores */}
          {filteredStores.length > 0 && (
            <ul className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg text-black text-left">
              {filteredStores.map((store) => (
                <li
                  key={store._id}
                  className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
                  onClick={() => handleSelectStore(store._id)}
                >
                  {store.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          className="bg-white text-[#9400A5] font-semibold px-5 py-3 rounded-md border border-white hover:bg-purple-100 transition"
          onClick={() => {
            if (filteredStores.length === 1)
              handleSelectStore(filteredStores[0]._id);
          }}
        >
          Search Stores
        </button>
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
