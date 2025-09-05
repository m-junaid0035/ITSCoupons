"use client";

import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ISEO {
  _id: string;
  metaTitle: string;
  templateType: string;
  metaDescription?: string;
  metaKeywords?: string[];
  focusKeywords?: string[];
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

type SEOModalProps = {
  seo: ISEO;
  isOpen: boolean;
  onClose: () => void;
};

export default function SEOModal({ seo, isOpen, onClose }: SEOModalProps) {
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
            View SEO Entry
          </h2>
        </header>

        <section className="space-y-4">
          {/* Meta Title */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Meta Title</p>
            <Badge className="bg-indigo-600 dark:bg-indigo-500">{seo.metaTitle || "N/A"}</Badge>
          </div>

          {/* Meta Description */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Meta Description</p>
            <p className="text-gray-700 dark:text-gray-300">{seo.metaDescription || "N/A"}</p>
          </div>

          {/* Meta Keywords */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Meta Keywords</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {seo.metaKeywords && seo.metaKeywords.length > 0 ? (
                seo.metaKeywords.map((keyword, i) => (
                  <Badge key={i} className="bg-yellow-500 dark:bg-yellow-400">{keyword}</Badge>
                ))
              ) : (
                <span className="text-gray-500 dark:text-gray-400">N/A</span>
              )}
            </div>
          </div>

          {/* Focus Keywords */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Focus Keywords</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {seo.focusKeywords && seo.focusKeywords.length > 0 ? (
                seo.focusKeywords.map((keyword, i) => (
                  <Badge key={i} className="bg-green-600 dark:bg-green-500">{keyword}</Badge>
                ))
              ) : (
                <span className="text-gray-500 dark:text-gray-400">N/A</span>
              )}
            </div>
          </div>

          {/* Slug */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Slug</p>
            <Badge className="bg-gray-600 dark:bg-gray-400">{seo.slug}</Badge>
          </div>

          {/* Created At */}
          {seo.createdAt && (
            <div className="text-sm text-gray-400 dark:text-gray-500">
              Created: {new Date(seo.createdAt).toLocaleString()}
            </div>
          )}

          {/* Updated At */}
          {seo.updatedAt && (
            <div className="text-sm text-gray-400 dark:text-gray-500">
              Updated: {new Date(seo.updatedAt).toLocaleString()}
            </div>
          )}
        </section>

        <footer className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </footer>
      </div>
    </div>
  );
}
