// app/admin/categories/view/[id]/page.tsx
import { getCategoryById } from "@/functions/categoryFunctions";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface Category {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt?: string;
  isPopular?: boolean;
  isTrending?: boolean;
  description?: string | null;
}
export default async function CategoryViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rawCategory = await getCategoryById(id);

  if (!rawCategory) return notFound();

  const category = rawCategory as Category;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          View Category
        </h2>
      </header>

      <section className="space-y-6">
        {/* Name */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {category.name}
          </p>
        </div>

        {/* Slug */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Slug</p>
          <Badge variant="secondary">{category.slug}</Badge>
        </div>

        {/* Description (optional) */}
        {category.description && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
            <div
              className="prose prose-purple dark:prose-invert max-w-none text-base"
              dangerouslySetInnerHTML={{ __html: category.description }}
            />
          </div>
        )}


        {/* Popular / Trending */}
        <div className="flex items-center gap-2">
          {category.isPopular && <Badge variant="destructive">Popular</Badge>}
          {category.isTrending && <Badge variant="outline">Trending</Badge>}
        </div>

        {/* Created At */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
          <p className="text-sm text-gray-400">
            {category.createdAt
              ? new Date(category.createdAt).toLocaleString()
              : "N/A"}
          </p>
        </div>

        {/* Updated At */}
        {category.updatedAt && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Updated At</p>
            <p className="text-sm text-gray-400">
              {new Date(category.updatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
