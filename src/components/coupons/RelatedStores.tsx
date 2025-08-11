"use client";

import Image from "next/image";
import type { StoreData } from "@/types/store";

interface RelatedStoresProps {
  stores: StoreData[];
  loading?: boolean;
  error?: string | null;
}

export default function RelatedStores({ stores, loading, error }: RelatedStoresProps) {
  if (loading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-md py-10 px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-10">Related Stores</h2>
        <p>Loading stores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-xl shadow-md py-10 px-6 text-center text-red-600">
        <h2 className="text-2xl font-bold text-gray-800 mb-10">Related Stores</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!stores || stores.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl shadow-md py-10 px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-10">Related Stores</h2>
        <p>No related stores found.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-md py-10 px-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">
        Related Stores
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 max-w-[1280px] mx-auto">
        {stores.map((store) => (
          <div
            key={store._id}
            className="flex flex-col items-center"
            style={{ minWidth: "150px" }}
          >
            <div className="bg-white shadow border border-gray-200 rounded-2xl h-28 w-28 flex items-center justify-center mb-3">
              <Image
                src={store.image}
                alt={store.name}
                width={80}
                height={80}
                className="object-contain"
                priority={false}
              />
            </div>
            <div className="text-sm text-purple-800 font-semibold text-center">
              {store.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
