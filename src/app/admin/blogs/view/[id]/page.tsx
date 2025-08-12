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
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">View Blog</h2>
        {/* You can add a back button or edit button here if needed */}
      </header>

      <section className="space-y-6">
        {/* Title */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Title</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{blog.title}</p>
        </div>

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
            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{blog.description}</p>
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
        {blog.metaKeywords?.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Meta Keywords</p>
            <div className="flex flex-wrap gap-2">
              {blog.metaKeywords.map((keyword: string, idx: number) => (
                <Badge key={idx} variant="secondary">{keyword}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Focus Keywords */}
        {blog.focusKeywords?.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Focus Keywords</p>
            <div className="flex flex-wrap gap-2">
              {blog.focusKeywords.map((keyword: string, idx: number) => (
                <Badge key={idx}>{keyword}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Created At */}
        {blog.createdAt && (
          <p className="text-sm text-gray-400">
            Created: {new Date(blog.createdAt).toLocaleString()}
          </p>
        )}
      </section>
    </div>
  );
}
