"use client";

import type { StoreWithCouponsData } from "@/types/storesWithCouponsData";
import type { CategoryData } from "@/types/category";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface StoreCardProps {
  stores: StoreWithCouponsData[];
  categories: CategoryData[];
  category: string;
}

export default function StoreCard({
  stores,
  categories,
  category,
}: StoreCardProps) {
  const categoryFromQuery = category;

  const [selectedCategoryId, setSelectedCategoryId] = useState(() => {
    const matchedCategory = categories.find(
      (c) => c._id === categoryFromQuery || c.slug === categoryFromQuery
    );
    return matchedCategory?._id || "all";
  });

  const categoriesWithAll = [{ _id: "all", name: "All" }, ...categories];

  const filteredStores =
    selectedCategoryId === "all"
      ? stores
      : stores.filter((store) => store.categories.includes(selectedCategoryId));

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const copyCodeToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setDialogMessage(`Copied coupon code: ${code}`);
    setDialogOpen(true);
  };

  return (
    <section className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Browse All Stores
      </h1>

      {/* Filter Buttons */}
      <nav
        aria-label="Store categories filter"
        className="flex flex-wrap gap-2 mb-6"
      >
        {categoriesWithAll.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategoryId(cat._id)}
            className={`px-4 py-1 rounded-full text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-purple-600 ${selectedCategoryId === cat._id
                ? "bg-purple-700 text-white border-purple-700"
                : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
              }`}
            aria-pressed={selectedCategoryId === cat._id}
            type="button"
          >
            {cat.name}
          </button>
        ))}
      </nav>

      {/* Store Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store) => (
          <article
            key={store._id}
            className="border rounded-lg shadow-md p-6 bg-white flex flex-col"
          >
            {/* Store Image */}
            <div className="flex justify-center mb-4">
              <img
                src={store.image}
                alt={`${store.name} store image`}
                className="h-20 w-32 object-contain rounded-md bg-gray-100"
                loading="lazy"
              />
            </div>

            {/* Store Name */}
            <h2 className="text-center text-purple-700 font-bold text-lg mb-2">
              {store.name}
            </h2>

            <hr className="border-gray-300 mb-4" />

            {/* Coupons Section */}
            <div className="flex-1">   {/* 👈 makes this section expand */}
              <h3 className="text-gray-800 font-semibold mb-3 text-sm">
                Latest Coupons
              </h3>

              {store.coupons && store.coupons.length > 0 ? (
                <ul className="space-y-3 max-h-48 overflow-y-auto">
                  {store.coupons.map((coupon) => (
                    <li
                      key={coupon._id}
                      className="bg-purple-50 rounded-md p-3 flex flex-col"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-semibold text-gray-900 text-sm max-w-[70%]">
                          {coupon.title}
                        </p>
                        <button
                          type="button"
                          onClick={() => copyCodeToClipboard(coupon.couponCode)}
                          className="text-purple-700 text-xs font-semibold bg-purple-200 rounded px-3 py-1 hover:bg-purple-300 transition"
                        >
                          Copy Code
                        </button>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span className="font-semibold text-purple-700">
                          {coupon.couponCode}
                        </span>
                        {coupon.expirationDate && (
                          <span>
                            Expires:{" "}
                            {new Date(coupon.expirationDate).toISOString().split("T")[0]}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-xs italic">No coupons available.</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <a
                href={`/stores/${store._id}`}
                className="flex-grow bg-purple-700 text-white text-center py-2 rounded-md text-sm font-semibold hover:bg-purple-800 transition"
              >
                View All Coupons
              </a>

              <a
                href={store.storeNetworkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-grow bg-gray-200 text-gray-700 text-center py-2 rounded-md text-sm font-semibold hover:bg-gray-300 transition"
              >
                Visit Store
              </a>
            </div>
          </article>

        ))}
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Coupon Copied
            </DialogTitle>
          </DialogHeader>
          <p className="py-2 text-sm sm:text-base">{dialogMessage}</p>
          <DialogFooter>
            <Button
              className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition shadow-sm"
              onClick={() => setDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
