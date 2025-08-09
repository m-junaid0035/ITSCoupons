"use client";

import React from "react";

interface Store {
  _id: string;
  name: string;
}

interface ButtonGridProps {
  stores: Store[];
}

const ButtonGrid: React.FC<ButtonGridProps> = ({ stores }) => (
  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
    {stores.map((store) => (
      <button
        key={store._id}
        className="py-2 px-6 rounded-md border border-gray-300 bg-white shadow-sm hover:bg-gray-100 transition"
      >
        {store.name}
      </button>
    ))}
  </div>
);

interface StoresComponentProps {
  recentlyUpdatedStores: Store[];
  popularStores: Store[];
}

const StoresComponent: React.FC<StoresComponentProps> = ({
  recentlyUpdatedStores,
  popularStores,
}) => (
  <div className="w-full max-w-6xl mx-auto py-12">
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-center mb-8 text-purple-700">
        Store Recently Updated
      </h2>
      <div className="flex justify-center">
        <ButtonGrid stores={recentlyUpdatedStores} />
      </div>
    </div>
    <div>
      <h2 className="text-2xl font-bold text-center mb-8 text-purple-700">
        Popular Stores
      </h2>
      <div className="flex justify-center">
        <ButtonGrid stores={popularStores} />
      </div>
    </div>
  </div>
);

export default StoresComponent;
