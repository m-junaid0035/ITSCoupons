"use client";

import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";

interface IBlog {
  _id: string;
  title: string;
  date: string;
  description?: string;
  image?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  focusKeywords?: string;
  slug?: string;
  writer?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

type BlogModalProps = {
  blog: IBlog;
  isOpen: boolean;
  onClose: () => void;
};

export default function BlogModal({ blog, isOpen, onClose }: BlogModalProps) {
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
        {/* Cross Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold"
        >
          ✕
        </button>

        <header className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            View Blog
          </h2>
        </header>

        <section className="space-y-4">
          {/* Title */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Title</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {blog.title}
            </p>
          </div>

          {/* Writer */}
          {blog.writer && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Writer</p>
              <p className="text-gray-700 dark:text-gray-300">{blog.writer}</p>
            </div>
          )}

          {/* Category */}
          {blog.category && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
              <Badge variant="secondary">{blog.category}</Badge>
            </div>
          )}

          {/* Slug */}
          {blog.slug && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Slug</p>
              <Badge variant="secondary">{blog.slug}</Badge>
            </div>
          )}

          {/* Date */}
          {blog.date && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
              <Badge>{new Date(blog.date).toLocaleDateString()}</Badge>
            </div>
          )}

          {/* Description */}
          {blog.description && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
              <div
                className="prose prose-purple dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.description }}
              />
            </div>
          )}

          {/* Image */}
          {blog.image && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Image</p>
              <img
                src={blog.image}
                alt={`Image for ${blog.title}`}
                className="w-full max-h-80 object-contain rounded-md border border-gray-300 dark:border-gray-700"
                loading="lazy"
              />
            </div>
          )}

          {/* Meta Title */}
          {blog.metaTitle && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Meta Title</p>
              <p className="text-gray-700 dark:text-gray-300">{blog.metaTitle}</p>
            </div>
          )}

          {/* Meta Description */}
          {blog.metaDescription && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Meta Description</p>
              <p className="text-gray-700 dark:text-gray-300">{blog.metaDescription}</p>
            </div>
          )}

          {/* Meta Keywords */}
          {blog.metaKeywords && blog.metaKeywords.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Meta Keywords</p>
              <Badge variant="secondary">{blog.metaKeywords}</Badge>
            </div>
          )}

          {/* Focus Keywords */}
          {blog.focusKeywords && blog.focusKeywords.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Focus Keywords</p>
              <Badge>{blog.focusKeywords}</Badge>
            </div>
          )}

          {/* Created & Updated At */}
          <div className="text-sm text-gray-400 space-y-1">
            {blog.createdAt && (
              <p>Created: {new Date(blog.createdAt).toLocaleString()}</p>
            )}
            {blog.updatedAt && (
              <p>Updated: {new Date(blog.updatedAt).toLocaleString()}</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
