"use client";

import Link from "next/link";

interface Store {
  _id: string;
  name: string;
  image?: string;
  slug?: string;
  isActive?: boolean;
  isPopular?: boolean;
}

interface FeaturedStoresProps {
  stores: Store[];
  loading?: boolean; // Optional if you want to show loading inside too
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
            className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center rounded-full border border-gray-300 shadow-sm overflow-hidden bg-white transition hover:scale-105"
          >
            <img
              src={store.image || "/placeholder-store.png"}
              alt={store.name}
              className="w-16 md:w-20 object-contain"
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
