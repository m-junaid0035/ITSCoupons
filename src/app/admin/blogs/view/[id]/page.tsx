import { fetchBlogByIdAction } from "@/actions/blogActions";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface BlogViewPageProps {
  params: { id: string };
}

export default async function BlogViewPage({ params }: BlogViewPageProps) {
  const result = await fetchBlogByIdAction(params.id);

  if (!result || result.error || !result.data) return notFound();

  const blog = result.data;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">View Blog</h2>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <p className="text-sm text-gray-500">Title</p>
          <p className="text-lg font-medium">{blog.title}</p>
        </div>

        {/* Slug */}
        <div>
          <p className="text-sm text-gray-500">Slug</p>
          <Badge>{blog.slug}</Badge>
        </div>

        {/* Description */}
        {blog.description && (
          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="text-gray-700 whitespace-pre-wrap">{blog.description}</p>
          </div>
        )}

        {/* Image */}
        {blog.image && (
          <div>
            <p className="text-sm text-gray-500">Image</p>
            <img
              src={blog.image}
              alt="Blog Image"
              className="w-full h-auto rounded-md border"
            />
          </div>
        )}

        {/* Date */}
        {blog.date && (
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <Badge>{new Date(blog.date).toLocaleDateString()}</Badge>
          </div>
        )}

        {/* Meta Title */}
        {blog.metaTitle && (
          <div>
            <p className="text-sm text-gray-500">Meta Title</p>
            <p className="text-gray-700">{blog.metaTitle}</p>
          </div>
        )}

        {/* Meta Description */}
        {blog.metaDescription && (
          <div>
            <p className="text-sm text-gray-500">Meta Description</p>
            <p className="text-gray-700">{blog.metaDescription}</p>
          </div>
        )}

        {/* Meta Keywords */}
        {blog.metaKeywords?.length > 0 && (
          <div>
            <p className="text-sm text-gray-500">Meta Keywords</p>
            <div className="flex flex-wrap gap-2">
              {blog.metaKeywords.map((keyword: string, index: number) => (
                <Badge key={index} variant="secondary">{keyword}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Focus Keywords */}
        {blog.focusKeywords?.length > 0 && (
          <div>
            <p className="text-sm text-gray-500">Focus Keywords</p>
            <div className="flex flex-wrap gap-2">
              {blog.focusKeywords.map((keyword: string, index: number) => (
                <Badge key={index}>{keyword}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Created At */}
        {blog.createdAt && (
          <div className="text-sm text-gray-400">
            Created: {new Date(blog.createdAt).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
