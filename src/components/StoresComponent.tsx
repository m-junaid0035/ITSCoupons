"use client";

import type { StoreData } from "@/types/store";

interface ButtonGridProps {
  stores: StoreData[];
}

function ButtonGrid({ stores }: ButtonGridProps) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-y-6 gap-x-12 justify-items-center w-full">
      {stores.map((store) => (
        <button
          key={store._id}
          style={{
            width: "166px",
            height: "38px",
            borderRadius: "12px",
            borderWidth: "1px",
            padding: "6px 16px",
            gap: "10px",
            boxShadow: "0px 4px 4px 0px #00000040",
          }}
          className="border border-gray-300 bg-white shadow-sm hover:bg-gray-100 transition font-medium"
        >
          {store.name}
        </button>
      ))}
    </div>
  );
}

interface StoresComponentProps {
  recentlyUpdatedStores: StoreData[];
  popularStores: StoreData[];
  loadingRecentlyUpdatedStores?: boolean;
  loadingPopularStores?: boolean;
}

export default function StoresComponent({
  recentlyUpdatedStores,
  popularStores,
  loadingRecentlyUpdatedStores = false,
  loadingPopularStores = false,
}: StoresComponentProps) {
  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      {/* Recently Updated Section */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-purple-700 text-center mb-3">
          Stores Recently Updated
        </h2>

        <div className="flex justify-end mb-5">
          <a href="#" className="text-sm text-purple-700 hover:underline">
            VIEW ALL
          </a>
        </div>

        {loadingRecentlyUpdatedStores ? (
          <div className="text-purple-700 font-semibold text-center">Loading...</div>
        ) : (
          <ButtonGrid stores={recentlyUpdatedStores} />
        )}
      </section>

      {/* Popular Stores Section */}
      <section>
        <h2 className="text-2xl font-bold text-purple-700 text-center mb-3">
          Popular Stores
        </h2>

        <div className="flex justify-end mb-5">
          <a href="#" className="text-sm text-purple-700 hover:underline">
            VIEW ALL
          </a>
        </div>

        {loadingPopularStores ? (
          <div className="text-purple-700 font-semibold text-center">Loading...</div>
        ) : (
          <ButtonGrid stores={popularStores} />
        )}
      </section>
    </div>
  );
}
