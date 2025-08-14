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
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-8">
        The Latest from our blogs
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10 max-w-6xl mx-auto justify-items-center ml-12">
        {blogs.map((blog) => {
          const formattedDate = blog.date
            ? new Date(blog.date).toLocaleDateString()
            : "";

          return (
            <div
              key={blog._id}
              className="flex flex-col items-center w-full max-w-[301px]"
            >
              {/* Image box */}
              <div className="w-full h-[150px] bg-gray-300 rounded-[12px] overflow-hidden">
                {blog.image ? (
                  <img
                    src={blog.image}
                    alt={blog.title || "Blog image"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300" />
                )}
              </div>

              {/* Lower content box */}
              <div
                className="w-full h-[148px] bg-white rounded-[12px] shadow-md -mt-6 z-10 flex flex-col justify-between p-4 text-left"
                style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
              >
                <p className="text-sm text-gray-500">{formattedDate}</p>
                <h3 className="text-base font-semibold mb-2">{blog.title}</h3>
                <a
                  href={`/blogs/${blog._id}`}
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
