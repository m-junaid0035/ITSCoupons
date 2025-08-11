"use client";

import Link from "next/link";
import type { StoreData } from "@/types/store";

interface FeaturedStoresProps {
  stores: StoreData[];
  loading?: boolean;
}

export default function FeaturedStores({ stores, loading = false }: FeaturedStoresProps) {
  if (loading) {
    return (
      <section className="py-16 bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-10">
          Featured Stores
        </h2>
        <p className="text-gray-500">Loading stores...</p>
      </section>
    );
  }

  if (!stores.length) {
    return (
      <section className="py-16 bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-10">
          Featured Stores
        </h2>
        <p className="text-gray-500">No featured stores available</p>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-10">
        Featured Stores
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 justify-items-center px-4 md:px-16">
        {stores.map((store) => (
          <Link
            key={store._id}
            href={`/store/${store.slug || store._id}`}
            className="flex items-center justify-center bg-white overflow-hidden transition hover:scale-105"
            style={{
              width: "178px",
              height: "178px",
              borderRadius: "100px",
              border: "1px solid #C4C4C4",
              boxShadow: "0px 4px 4px 0px #00000040"
            }}
          >
            <img
              src={store.image || "/placeholder-store.png"}
              alt={store.name}
              className="object-contain"
              style={{ maxWidth: "70%", maxHeight: "70%" }}
            />
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <Link
          href="/stores"
          className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-8 py-3 rounded-lg text-sm md:text-base inline-block"
        >
          View All Stores
        </Link>
      </div>
    </section>
  );
}
