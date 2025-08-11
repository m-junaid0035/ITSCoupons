"use client";

import type { StoreData } from "@/types/store";

interface ButtonGridProps {
  stores: StoreData[];
}

function ButtonGrid({ stores }: ButtonGridProps) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
      {stores.map((store) => (
        <button
          key={store._id}
          style={{
            width: "166px",
            height: "38px",
            borderRadius: "12px",
            borderWidth: "1px",
            padding: "3px 14px",
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
    <div className="w-full max-w-6xl mx-auto py-12">
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8 text-purple-700">
          Stores Recently Updated
        </h2>
        <div className="flex justify-center flex-wrap gap-4">
          {loadingRecentlyUpdatedStores ? (
            <div className="text-purple-700 font-semibold">Loading...</div>
          ) : (
            <ButtonGrid stores={recentlyUpdatedStores} />
          )}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-center mb-8 text-purple-700">
          Popular Stores
        </h2>
        <div className="flex justify-center flex-wrap gap-4">
          {loadingPopularStores ? (
            <div className="text-purple-700 font-semibold">Loading...</div>
          ) : (
            <ButtonGrid stores={popularStores} />
          )}
        </div>
      </div>
    </div>
  );
}
