import React from "react";
import { fetchBlogByIdAction } from "@/actions/blogActions";
import type { BlogData } from "@/types/blog";
import BlogShow from "@/components/BlogShow";

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<URLSearchParams>;
}) {
  // Await the params
  const { id } = await params;

  // Fetch the blog
  const result = await fetchBlogByIdAction(id);
  const blog: BlogData | null = result.data ?? null;

  if (!blog) {
    return (
      <div className="py-16 text-center text-red-600">
        <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong</h2>
        <p className="text-lg">{result.error?.message || "Failed to load the blog."}</p>
      </div>
    );
  }

  return <BlogShow blog={blog} />;
}
