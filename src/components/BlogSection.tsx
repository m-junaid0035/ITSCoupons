"use client";

import React from "react";
import type { BlogData } from "@/types/blog";

interface BlogSectionProps {
  blogs: BlogData[];
  loading: boolean;
  error?: string | null;
}

export default function BlogSection({
  blogs,
  loading,
  error = null,
}: BlogSectionProps): JSX.Element {
  if (loading) return <p className="text-center py-10">Loading blogs...</p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;
  if (blogs.length === 0)
    return <p className="text-center py-10">No blogs available.</p>;

  return (
    <section className="py-12 px-4 bg-white text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-8">
        The Latest from our blogs
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {blogs.map((blog) => {
          const formattedDate = blog.date
            ? new Date(blog.date).toLocaleDateString()
            : "";

          return (
            <div
              key={blog._id}
              className="bg-gray-100 rounded-[12px] overflow-hidden shadow-md flex flex-col
                w-full md:w-[301px] md:h-[298px] mx-auto"
            >
              {blog.image ? (
                <img
                  src={blog.image}
                  alt={blog.title || "Blog image"}
                  className="object-cover rounded-t-[12px] w-full h-[150px]"
                  loading="lazy"
                />
              ) : (
                <div className="h-[150px] bg-gray-300 rounded-t-[12px]" />
              )}
              <div className="p-4 text-left md:h-[148px] flex flex-col justify-between">
                <p className="text-sm text-gray-500">{formattedDate}</p>
                <h3 className="text-base font-semibold mb-2">{blog.title}</h3>
                <a
                  href={`/blogs/${blog.slug || blog._id}`}
                  className="text-purple-700 font-semibold hover:underline flex items-center"
                >
                  Read More... <span className="ml-1 text-purple-700">→</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
