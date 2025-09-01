"use client";

import { getStoreById } from "@/functions/storeFunctions";
import { getNetworkById } from "@/functions/networkFunctions";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default async function StoreViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const store = await getStoreById(id);

  if (!store) return notFound();

  // Fetch network name using network ID if available
  let networkName = "N/A";
  let storeNetworkUrl = "N/A";
  if (store.network) {
    const network = await getNetworkById(store.network);
    if (network) {
      networkName = network.networkName;
      storeNetworkUrl = network.storeNetworkUrl || "N/A";
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        View Store
      </h2>

      {/* Store Image */}
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Store Image</p>
        {store.image ? (
          <img
            src={store.image}
            alt={store.name}
            className="w-48 h-48 object-cover rounded shadow"
          />
        ) : (
          <p className="text-gray-400 dark:text-gray-500">No image available</p>
        )}
      </div>

      <div className="space-y-4">
        {/* Store Name */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Store Name</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{store.name || "N/A"}</p>
        </div>

        {/* Network Name */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Network Name</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{networkName}</p>
        </div>

        {/* Store Network URL */}
        {networkName !== "N/A" && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Store Network URL</p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{storeNetworkUrl}</p>
          </div>
        )}

        {/* Categories */}
        <div>
          <p className="text-sm text-gray-500 mb-1 dark:text-gray-400">Categories</p>
          <div className="flex flex-wrap gap-2">
            {store.categories?.length > 0 ? (
              store.categories.map((cat: string) => (
                <Badge key={cat} variant="default">{cat}</Badge>
              ))
            ) : (
              <span className="text-gray-400 dark:text-gray-500">None</span>
            )}
          </div>
        </div>

        {/* Total Coupon Used Times */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Coupon Used Times</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{store.totalCouponUsedTimes ?? 0}</p>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{store.description || "N/A"}</p>
        </div>

        {/* SEO Fields */}
        <div className="space-y-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Meta Title</p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{store.metaTitle || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Meta Description</p>
            <p className="text-gray-700 dark:text-gray-300">{store.metaDescription || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Meta Keywords</p>
            <p className="text-gray-700 dark:text-gray-300">
              {(store.metaKeywords?.length ?? 0) > 0 ? store.metaKeywords.join(", ") : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Focus Keywords</p>
            <p className="text-gray-700 dark:text-gray-300">
              {(store.focusKeywords?.length ?? 0) > 0 ? store.focusKeywords.join(", ") : "N/A"}
            </p>
          </div>
        </div>

        {/* Popular & Status */}
        <div className="flex gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Popular</p>
            <Badge variant={store.isPopular ? "default" : "secondary"}>
              {store.isPopular ? "Yes" : "No"}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <Badge variant={store.isActive ? "default" : "destructive"}>
              {store.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        {/* Slug */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Slug</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{store.slug || "N/A"}</p>
        </div>

        {/* Created At */}
        <div className="text-sm text-gray-400 dark:text-gray-500">
          Created: {store.createdAt ? new Date(store.createdAt).toLocaleString() : "N/A"}
        </div>
      </div>
    </div>
  );
}
