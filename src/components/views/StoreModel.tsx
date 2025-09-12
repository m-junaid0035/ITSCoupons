"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { fetchNetworkByIdAction } from "@/actions/networkActions"; // server actions
import { fetchCategoryByIdAction } from "@/actions/categoryActions";

export interface IStore {
  _id: string;
  name: string;
  image?: string;
  network?: string;
  description?: string;
  categories?: string[]; // category IDs
  totalCouponUsedTimes?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  focusKeywords?: string[];
  isPopular?: boolean;
  isActive?: boolean;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
  totalCoupons?: number;
  storeNetworkUrl?: string;
}

type StoreModalProps = {
  store: IStore;
  isOpen: boolean;
  onClose: () => void;
};

export default function StoreModal({ store, isOpen, onClose }: StoreModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [networkName, setNetworkName] = useState<string>("N/A");
  const [categoryNames, setCategoryNames] = useState<string[]>([]);

  // Close modal if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Fetch network name & categories when modal opens
  useEffect(() => {
    if (!isOpen) return;

    async function fetchData() {
      // Fetch network name
      if (store.network) {
        try {
          const res = await fetchNetworkByIdAction(store.network);
          if (res.data?.networkName) {
            setNetworkName(res.data.networkName);
          }
        } catch {
          setNetworkName("N/A");
        }
      } else {
        setNetworkName("N/A");
      }

      // Fetch category names
      if (store.categories?.length) {
        const names: string[] = [];
        for (const id of store.categories) {
          try {
            const res = await fetchCategoryByIdAction(id);
            if (res.data?.name) names.push(res.data.name);
          } catch { }
        }
        setCategoryNames(names);
      } else {
        setCategoryNames([]);
      }
    }

    fetchData();
  }, [isOpen, store]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-auto">
      <div
        ref={modalRef}
        className="relative max-w-3xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-y-auto max-h-[90vh] p-6 space-y-6"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold"
        >
          ✕
        </button>

        <header className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            View Store
          </h2>
        </header>

        <section className="space-y-4">
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

          {/* Store Name */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Store Name</p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {store.name || "N/A"}
            </p>
          </div>

          {/* Network */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Network Name</p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{networkName}</p>
          </div>

          {networkName !== "N/A" && store.storeNetworkUrl && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Store Network URL</p>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {store.storeNetworkUrl}
              </p>
            </div>
          )}

          {/* Categories */}
          <div>
            <p className="text-sm text-gray-500 mb-1 dark:text-gray-400">Categories</p>
            <div className="flex flex-wrap gap-2">
              {categoryNames.length ? (
                categoryNames.map((cat) => <Badge key={cat}>{cat}</Badge>)
              ) : (
                <span className="text-gray-400 dark:text-gray-500">None</span>
              )}
            </div>
          </div>

          {/* Total Coupon Used Times */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Coupon Used Times</p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {store.totalCouponUsedTimes ?? 0}
            </p>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
            <div
              className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: store.description || "N/A",
              }}
            />
          </div>


          {/* SEO Fields */}
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Meta Title</p>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {store.metaTitle || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Meta Description</p>
              <p className="text-gray-700 dark:text-gray-300">
                {store.metaDescription || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Meta Keywords</p>
              <p className="text-gray-700 dark:text-gray-300">
                {store.metaKeywords?.length ? store.metaKeywords.join(", ") : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Focus Keywords</p>
              <p className="text-gray-700 dark:text-gray-300">
                {store.focusKeywords?.length ? store.focusKeywords.join(", ") : "N/A"}
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
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {store.slug || "N/A"}
            </p>
          </div>

          {/* Created & Updated */}
          <div className="text-sm text-gray-400 dark:text-gray-500">
            Created: {store.createdAt ? new Date(store.createdAt).toLocaleString() : "N/A"}
          </div>
          <div className="text-sm text-gray-400 dark:text-gray-500">
            Updated: {store.updatedAt ? new Date(store.updatedAt).toLocaleString() : "N/A"}
          </div>
        </section>
      </div>
    </div>
  );
}
