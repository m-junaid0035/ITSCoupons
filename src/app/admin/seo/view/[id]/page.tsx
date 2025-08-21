import { fetchSEOByIdAction } from "@/actions/seoActions";
import { notFound } from "next/navigation";

interface SEOType {
  _id: string;
  metaTitle: string;
  metaDescription?: string;
  metaKeywords?: string[];
  focusKeywords?: string[];
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export default async function SEOViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await fetchSEOByIdAction(id);

  if (!result || result.error || !result.data) return notFound();

  const seo: SEOType = result.data;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        View SEO Entry
      </h2>

      <div className="space-y-4">
        {/* Meta Title */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Meta Title</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {seo.metaTitle || "N/A"}
          </p>
        </div>

        {/* Meta Description */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Meta Description</p>
          <p className="text-gray-700 dark:text-gray-300">
            {seo.metaDescription || "N/A"}
          </p>
        </div>

        {/* Meta Keywords */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Meta Keywords</p>
          <p className="text-gray-700 dark:text-gray-300">
            {seo.metaKeywords && seo.metaKeywords.length > 0
              ? seo.metaKeywords.join(", ")
              : "N/A"}
          </p>
        </div>

        {/* Focus Keywords */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Focus Keywords</p>
          <p className="text-gray-700 dark:text-gray-300">
            {seo.focusKeywords && seo.focusKeywords.length > 0
              ? seo.focusKeywords.join(", ")
              : "N/A"}
          </p>
        </div>

        {/* Slug */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Slug</p>
          <p className="text-gray-700 dark:text-gray-300">{seo.slug}</p>
        </div>

        {/* Created At */}
        {seo.createdAt && (
          <div className="text-sm text-gray-400 dark:text-gray-500">
            Created: {new Date(seo.createdAt).toLocaleString()}
          </div>
        )}

        {/* Updated At */}
        {seo.updatedAt && (
          <div className="text-sm text-gray-400 dark:text-gray-500">
            Updated: {new Date(seo.updatedAt).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
