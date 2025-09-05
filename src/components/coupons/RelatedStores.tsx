"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import type { StoreData } from "@/types/store";

interface RelatedStoresProps {
  stores: StoreData[];
  perPage?: number; // allow customizing items per page
}

export default function RelatedStores({ stores, perPage = 12 }: RelatedStoresProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(stores.length / perPage));

  const paginatedStores = useMemo(() => {
    const start = (page - 1) * perPage;
    return stores.slice(start, start + perPage);
  }, [stores, page, perPage]);

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
        {paginatedStores.map((store) => (
          <Link
            key={store._id}
            href={`/stores/${store._id}/${store.slug}`}
            className="flex flex-col items-center justify-center bg-white overflow-hidden transition hover:scale-105 border border-gray-200 p-4"
            style={{ width: "178px", height: "178px" }} // square box
          >
            <img
              src={store.image || "/placeholder-store.png"}
              alt={store.name}
              className="object-cover w-full h-[120px]" // square image, no rounded corners
            />
            <div className="mt-3 text-sm font-semibold text-purple-800 text-center">
              {store.name}
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`px-3 py-1 border rounded ${page === 1 ? "text-gray-400 border-gray-200 cursor-not-allowed" : "border-purple-700 text-purple-700 hover:bg-purple-50"}`}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`h-8 w-8 rounded border text-sm ${n === page ? "bg-purple-700 text-white border-purple-700" : "border-gray-200 hover:bg-gray-50"}`}
            >
              {n}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className={`px-3 py-1 border rounded ${page === totalPages ? "text-gray-400 border-gray-200 cursor-not-allowed" : "border-purple-700 text-purple-700 hover:bg-purple-50"}`}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
