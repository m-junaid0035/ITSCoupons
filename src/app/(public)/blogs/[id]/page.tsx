// app/blogs/[id]/page.tsx
import React from "react";
import Image from "next/image";
import { fetchBlogByIdAction } from "@/actions/blogActions";
import type { BlogData } from "@/types/blog";

interface BlogPageProps {
  params: { id: string }; // route param
}

export default async function BlogPage({ params }: BlogPageProps) {
  const result = await fetchBlogByIdAction(params.id);

  if (result.error) {
    return (
      <div className="py-16 text-center text-red-600">
        <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong</h2>
        <p className="text-lg">{result.error.message?.[0] || "Failed to load the blog."}</p>
      </div>
    );
  }

  const blog: BlogData = result.data;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Blog Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-purple-800 mb-4 leading-tight">
        {blog.title}
      </h1>

      {/* Blog Date */}
      {blog.date && (
        <p className="text-gray-500 text-sm sm:text-base mb-6">
          {new Date(blog.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}

      {/* Blog Image */}
      {blog.image && (
        <div className="w-full h-64 sm:h-80 md:h-96 mb-8 overflow-hidden rounded-2xl shadow-lg relative">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover object-center transition-transform duration-500 hover:scale-105"
            priority
          />
        </div>
      )}

      {/* Blog Content */}
      <div className="prose prose-purple max-w-full sm:prose-lg md:prose-xl mx-auto">
        <p>{blog.description || "No description available."}</p>
      </div>
    </section>
  );
}
