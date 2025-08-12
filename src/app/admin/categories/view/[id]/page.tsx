// app/admin/categories/view/[id]/page.tsx
import { getCategoryById } from '@/functions/categoryFunctions';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge'; // if you want to use Badge for slug

interface Category {
  _id: string;
  name: string;
  slug: string;
  createdAt: string | Date;
}

interface CategoryViewPageProps {
  params: { id: string };
}

export default async function CategoryViewPage({ params }: CategoryViewPageProps) {
  const rawCategory = await getCategoryById(params.id);

  if (!rawCategory) return notFound();

  const category = rawCategory as Category;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">View Category</h2>
      </header>

      <section className="space-y-6">
        {/* Name */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{category.name}</p>
        </div>

        {/* Slug */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Slug</p>
          <Badge variant="secondary">{category.slug}</Badge>
        </div>

        {/* Created At */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
          <p className="text-sm text-gray-400">{new Date(category.createdAt).toLocaleString()}</p>
        </div>
      </section>
    </div>
  );
}
