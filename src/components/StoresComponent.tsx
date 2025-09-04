"use client";

import type { StoreData } from "@/types/store";
import Link from "next/link";

interface ButtonGridProps {
  stores: StoreData[];
}

function ButtonGrid({ stores }: ButtonGridProps) {
  if (!stores.length) {
    return <p className="text-center text-gray-500">No stores available.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-y-6 gap-x-4 sm:gap-x-6 justify-items-center w-full">
      {stores.map((store) => (
        <Link href={`/stores/${store._id}/${store.slug}`} key={store._id}>
          <button
            title={store.name} // shows full name on hover
            style={{
              width: "166px",
              height: "38px",
              borderRadius: "12px",
              borderWidth: "1px",
              padding: "6px 16px",
              gap: "10px",
              boxShadow: "0px 4px 4px 0px #00000040",
            }}
            className="border border-gray-300 bg-white shadow-sm hover:bg-gray-100 transition font-medium truncate"
          >
            {store.name}
          </button>
        </Link>
      ))}
    </div>
  );
}

interface StoresComponentProps {
  recentlyUpdatedStores: StoreData[];
  popularStores: StoreData[];
}

export default function StoresComponent({
  recentlyUpdatedStores,
  popularStores,
}: StoresComponentProps) {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Recently Updated Section */}
      <section className="mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 text-center mb-3">
          Stores Recently Updated
        </h2>

        <div className="flex justify-end mb-5">
          <a href="/stores" className="text-sm sm:text-base text-purple-700 hover:underline">
            VIEW ALL
          </a>
        </div>

        <ButtonGrid stores={recentlyUpdatedStores} />
      </section>

      {/* Popular Stores Section */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 text-center mb-3">
          Popular Stores
        </h2>

        <div className="flex justify-end mb-5">
          <a href="/stores" className="text-sm sm:text-base text-purple-700 hover:underline">
            VIEW ALL
          </a>
        </div>

        <ButtonGrid stores={popularStores} />
      </section>
    </div>
  );
}
