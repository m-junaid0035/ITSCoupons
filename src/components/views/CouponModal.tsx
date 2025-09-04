"use client";

import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";

export interface ICoupon {
  _id: string;
  title: string;
  description: string;
  couponType: "deal" | "coupon";
  status: "active" | "expired";
  couponCode: string;
  expirationDate: string; // may be undefined
  couponUrl: string;
  storeName?: string;
  storeId: string; // because of `?.toString()`
  isTopOne?: boolean;
  discount: number;
  uses: number;
  verified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

type CouponModalProps = {
  coupon: ICoupon;
  isOpen: boolean;
  onClose: () => void;
};

export default function CouponModal({ coupon, isOpen, onClose }: CouponModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-auto">
      <div
        ref={modalRef}
        className="relative max-w-3xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-y-auto max-h-[90vh] p-6 space-y-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold"
        >
          ✕
        </button>

        <header className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            View Coupon
          </h2>
        </header>

        <section className="space-y-4">
          {/* Title */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Title</p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {coupon.title}
            </p>
          </div>

          {/* Coupon Code */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Coupon Code</p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {coupon.couponCode}
            </p>
          </div>

          {/* Coupon Type */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Coupon Type</p>
            <Badge>{coupon.couponType}</Badge>
          </div>

          {/* Status */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <Badge
              className={coupon.status === "active" ? "bg-green-500" : "bg-red-500"}
            >
              {coupon.status}
            </Badge>
          </div>

          {/* Top One */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Top One</p>
            <Badge className={coupon.isTopOne ? "bg-blue-600" : "bg-gray-400"}>
              {coupon.isTopOne ? "Yes" : "No"}
            </Badge>
          </div>

          {/* Verified */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Verified</p>
            <Badge className={coupon.verified ? "bg-green-600" : "bg-gray-400"}>
              {coupon.verified ? "Yes" : "No"}
            </Badge>
          </div>

          {/* Discount */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Discount</p>
            <p className="text-lg text-gray-900 dark:text-gray-100">
              {coupon.discount}% Off
            </p>
          </div>

          {/* Uses */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Uses</p>
            <p className="text-lg text-gray-900 dark:text-gray-100">
              {coupon.uses}
            </p>
          </div>

          {/* Store Name */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Store Name</p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {coupon.storeName || "N/A"}
            </p>
          </div>

          {/* Store ID */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Store ID</p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {coupon.storeId}
            </p>
          </div>

          {/* Description */}
          {coupon.description && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
              <div
                className="prose prose-purple dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: coupon.description }}
              />
            </div>
          )}

          {/* Coupon URL */}
          {coupon.couponUrl && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Coupon URL</p>
              <a
                href={coupon.couponUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline break-all"
              >
                {coupon.couponUrl}
              </a>
            </div>
          )}

          {/* Expiration Date */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Expiration Date</p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {coupon.expirationDate
                ? new Date(coupon.expirationDate).toLocaleString()
                : "N/A"}
            </p>
          </div>

          {/* Created At */}
          {coupon.createdAt && (
            <div className="text-sm text-gray-400">
              Created: {new Date(coupon.createdAt).toLocaleString()}
            </div>
          )}

          {/* Updated At */}
          {coupon.updatedAt && (
            <div className="text-sm text-gray-400">
              Updated: {new Date(coupon.updatedAt).toLocaleString()}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
