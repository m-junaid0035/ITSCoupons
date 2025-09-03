// app/admin/staticpages/view/[id]/page.tsx
import { getStaticPageById } from "@/functions/staticPagesFunctions";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface StaticPage {
  _id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
}

export default async function StaticPageViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rawPage = await getStaticPageById(id);

  if (!rawPage) return notFound();

  const page = rawPage as StaticPage;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          View Static Page
        </h2>
      </header>

      <section className="space-y-6">
        {/* Title */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Title</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {page.title}
          </p>
        </div>

        {/* Slug */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Slug</p>
          <Badge variant="secondary">{page.slug}</Badge>
        </div>

        {/* Content */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Content</p>
          <div
            className="prose prose-purple dark:prose-invert max-w-none text-base"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>

        {/* Published */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
          {page.isPublished ? (
            <Badge variant="default">Published</Badge>
          ) : (
            <Badge variant="outline">Draft</Badge>
          )}
        </div>

        {/* Created At */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
          <p className="text-sm text-gray-400">
            {page.createdAt
              ? new Date(page.createdAt).toLocaleString()
              : "N/A"}
          </p>
        </div>

        {/* Updated At */}
        {page.updatedAt && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Updated At</p>
            <p className="text-sm text-gray-400">
              {new Date(page.updatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
