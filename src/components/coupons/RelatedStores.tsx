"use client";

import Link from "next/link";
import type { StoreData } from "@/types/store";

interface RelatedStoresProps {
  stores: StoreData[];
  loading?: boolean;
  error?: string | null;
}

export default function RelatedStores({ stores, loading, error }: RelatedStoresProps) {
  if (loading) {
    return (
      <section className="py-16 bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-10">
          Related Stores
        </h2>
        <p className="text-gray-500">Loading stores...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white text-center text-red-600">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-10">
          Related Stores
        </h2>
        <p>{error}</p>
      </section>
    );
  }

  if (!stores || stores.length === 0) {
    return (
      <section className="py-16 bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-10">
          Related Stores
        </h2>
        <p className="text-gray-500">No related stores found.</p>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-10">
        Related Stores
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 justify-items-center px-4 md:px-16">
        {stores.map((store) => (
          <Link
            key={store._id}
            href={`/stores/${store._id}`}
            className="flex flex-col items-center justify-center bg-white overflow-hidden transition hover:scale-105 border border-gray-200 rounded-xl p-4"
            style={{ width: "178px", height: "178px" }}
          >
            <img
              src={store.image || "/placeholder-store.png"}
              alt={store.name}
              className="object-contain w-full h-[120px]"
            />
            <div className="mt-3 text-sm font-semibold text-purple-800 text-center">
              {store.name}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
