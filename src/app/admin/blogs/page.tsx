"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchAllBlogsAction,
  deleteBlogAction,
} from "@/actions/blogActions";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
}

export default function BlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadBlogs() {
    setLoading(true);
    const result = await fetchAllBlogsAction();

    if (result.data && Array.isArray(result.data)) {
      setBlogs(result.data as IBlog[]);
    } else {
      console.error("Failed to fetch blogs", result.error);
    }

    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    setLoading(true);

    const result = await deleteBlogAction(id);

    if (result.error) {
      alert(result.error.message?.[0] || "Failed to delete blog");
    } else {
      await loadBlogs();
    }

    setLoading(false);
  }

  useEffect(() => {
    loadBlogs();
  }, []);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Blogs</CardTitle>
        <Button onClick={() => router.push("/admin/blogs/new")}>
          Create Blog
        </Button>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Image</th>
                <th className="p-2 text-left">Meta Title</th>
                <th className="p-2 text-left">Meta Description</th>
                <th className="p-2 text-left">Meta Keywords</th>
                <th className="p-2 text-left">Focus Keywords</th>
                <th className="p-2 text-left">Slug</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <tr key={blog._id} className="border-b hover:bg-muted/50">
                    <td className="p-2">{blog.title}</td>
                    <td className="p-2">
                      {new Date(blog.date).toLocaleDateString()}
                    </td>
                    <td className="p-2 line-clamp-2 max-w-xs">{blog.description || "-"}</td>
                    <td className="p-2">
                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt="Blog"
                          className="h-10 w-10 object-cover rounded"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-2">{blog.metaTitle || "-"}</td>
                    <td className="p-2 line-clamp-2 max-w-xs">
                      {blog.metaDescription || "-"}
                    </td>
                    <td className="p-2">{blog.metaKeywords || "-"}</td>
                    <td className="p-2">{blog.focusKeywords || "-"}</td>
                    <td className="p-2">{blog.slug || "-"}</td>
                    <td className="p-2 space-x-2">
                      <Button
                        variant="secondary"
                        onClick={() => router.push(`/admin/blogs/view/${blog._id}`)}
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => router.push(`/admin/blogs/edit/${blog._id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(blog._id)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="p-4 text-center text-muted-foreground">
                    No blogs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
