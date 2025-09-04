
"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { fetchBlogByIdAction } from "@/actions/blogActions";

interface BlogViewDialogProps {
  blogId: string;
  open: boolean;
  onClose: () => void;
}

export default function BlogViewDialog({ blogId, open, onClose }: BlogViewDialogProps) {
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    const fetchBlog = async () => {
      setLoading(true);
      const result = await fetchBlogByIdAction(blogId);
      if (result && result.data) {
        setBlog(result.data);
      } else {
        setBlog(null);
      }
      setLoading(false);
    };

    fetchBlog();
  }, [blogId, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 max-w-3xl w-full p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
        >
          ✕
        </button>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : !blog ? (
          <p className="text-center text-red-500">Blog not found</p>
        ) : (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{blog.title}</h2>

            {blog.writer && (
              <p className="text-gray-700 dark:text-gray-300">Writer: {blog.writer}</p>
            )}

            {blog.category && <Badge variant="secondary">{blog.category}</Badge>}
            {blog.slug && <Badge variant="secondary">{blog.slug}</Badge>}
            {blog.date && <Badge>{new Date(blog.date).toLocaleDateString()}</Badge>}

            {blog.description && (
              <div
                className="prose prose-purple dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.description }}
              />
            )}

            {blog.image && (
              <img
                src={blog.image}
                alt={`Image for ${blog.title}`}
                className="w-full max-h-80 object-contain rounded-md border border-gray-300 dark:border-gray-700"
                loading="lazy"
              />
            )}

            {blog.metaTitle && <p>Meta Title: {blog.metaTitle}</p>}
            {blog.metaDescription && <p>Meta Description: {blog.metaDescription}</p>}

            {blog.metaKeywords?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.metaKeywords.map((keyword: string, idx: number) => (
                  <Badge key={idx} variant="secondary">{keyword}</Badge>
                ))}
              </div>
            )}

            {blog.focusKeywords?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.focusKeywords.map((keyword: string, idx: number) => (
                  <Badge key={idx}>{keyword}</Badge>
                ))}
              </div>
            )}

            <div className="text-sm text-gray-400 space-y-1">
              {blog.createdAt && <p>Created: {new Date(blog.createdAt).toLocaleString()}</p>}
              {blog.updatedAt && <p>Updated: {new Date(blog.updatedAt).toLocaleString()}</p>}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
