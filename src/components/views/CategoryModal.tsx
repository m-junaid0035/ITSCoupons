"use client";

import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string | null;
  isPopular: boolean;
  isTrending: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

type CategoryModalProps = {
  category: ICategory;
  isOpen: boolean;
  onClose: () => void;
};

export default function CategoryModal({ category, isOpen, onClose }: CategoryModalProps) {
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
        className="relative max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-y-auto max-h-[90vh] p-6 space-y-6"
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
            View Category
          </h2>
        </header>

        <section className="space-y-6">
          {/* Name */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {category.name}
            </p>
          </div>

          {/* Slug */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Slug</p>
            <Badge variant="secondary">{category.slug}</Badge>
          </div>

          {/* Description */}
          {category.description && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
              <div
                className="prose prose-purple dark:prose-invert max-w-none text-base"
                dangerouslySetInnerHTML={{ __html: category.description }}
              />
            </div>
          )}

          {/* Popular / Trending */}
          <div className="flex items-center gap-2">
            {category.isPopular && <Badge variant="destructive">Popular</Badge>}
            {category.isTrending && <Badge variant="outline">Trending</Badge>}
          </div>

          {/* Created At */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
            <p className="text-sm text-gray-400">
              {category.createdAt
                ? new Date(category.createdAt).toLocaleString()
                : "N/A"}
            </p>
          </div>

          {/* Updated At */}
          {category.updatedAt && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Updated At</p>
              <p className="text-sm text-gray-400">
                {new Date(category.updatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
