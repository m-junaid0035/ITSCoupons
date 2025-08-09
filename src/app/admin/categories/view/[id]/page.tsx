// app/admin/categories/view/[id]/page.tsx
import { getCategoryById } from '@/functions/categoryFunctions';
import { notFound } from 'next/navigation';

// Define the shape of a category (ideally move this to types folder)
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

  // Explicitly type it
  const category = rawCategory as Category;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">View Category</h2>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="text-lg font-medium">{category.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Slug</p>
          <p className="text-lg font-medium">{category.slug}</p>
        </div>

        <div className="text-sm text-gray-400">
          Created: {new Date(category.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
