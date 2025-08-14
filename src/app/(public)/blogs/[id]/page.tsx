// app/blogs/[id]/page.tsx
"use server";

import React from "react";
import { fetchBlogByIdAction } from "@/actions/blogActions";
import type { BlogData } from "@/types/blog";

interface BlogPageProps {
  params: { id: string }; // URL param
}

export default async function BlogPage({ params }: BlogPageProps) {
  const result = await fetchBlogByIdAction(params.id);

  if (result.error) {
    return (
      <div className="py-12 text-center text-red-600">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p>{result.error.message?.[0] || "Failed to load blog."}</p>
      </div>
    );
  }

  const blog: BlogData = result.data;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Blog Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-purple-800 mb-6">
        {blog.title}
      </h1>

      {/* Blog Date */}
      {blog.date && (
        <p className="text-gray-500 mb-6">
          {new Date(blog.date).toLocaleDateString()}
        </p>
      )}

      {/* Blog Image */}
      {blog.image && (
        <div className="w-full h-[300px] mb-6 overflow-hidden rounded-xl shadow-md">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Blog Content / Description */}
      <div className="prose prose-purple max-w-full">
        <p>{blog.description || "No description available."}</p>
      </div>
    </section>
  );
}
