import { getStoreById } from '@/functions/storeFunctions';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

interface StoreViewPageProps {
  params: { id: string };
}

export default async function StoreViewPage({ params }: StoreViewPageProps) {
  const store = await getStoreById(params.id);

  if (!store) return notFound();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">View Store</h2>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <p className="text-sm text-gray-500">Store Name</p>
          <p className="text-lg font-medium">{store.name}</p>
        </div>

        {/* Store Network URL */}
        <div>
          <p className="text-sm text-gray-500">Store Network URL</p>
          <p className="text-lg font-medium">{store.storeNetworkUrl}</p>
        </div>

        {/* Categories */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Categories</p>
          <div className="flex flex-wrap gap-2">
            {store.categories?.length > 0 ? (
              store.categories.map((cat: string) => (
                <Badge key={cat}>{cat}</Badge>
              ))
            ) : (
              <span className="text-gray-400">None</span>
            )}
          </div>
        </div>

        {/* Image */}
        <div>
          <p className="text-sm text-gray-500">Image</p>
          {store.image ? (
            <img
              src={store.image}
              alt="Store"
              className="w-32 h-32 object-cover rounded"
            />
          ) : (
            <p className="text-gray-400">No image</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <p className="text-sm text-gray-500">Slug</p>
          <p className="text-lg font-medium">{store.slug}</p>
        </div>

        {/* Total Coupon Used Times */}
        <div>
          <p className="text-sm text-gray-500">Total Coupon Used Times</p>
          <p className="text-lg font-medium">{store.totalCouponUsedTimes ?? 0}</p>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-gray-500">Description</p>
          <p className="text-lg text-gray-700">{store.description}</p>
        </div>

        {/* Meta Title */}
        <div>
          <p className="text-sm text-gray-500">Meta Title</p>
          <p className="text-lg font-medium">{store.metaTitle}</p>
        </div>

        {/* Meta Description */}
        <div>
          <p className="text-sm text-gray-500">Meta Description</p>
          <p className="text-gray-700">{store.metaDescription}</p>
        </div>

        {/* Meta Keywords */}
        <div>
          <p className="text-sm text-gray-500">Meta Keywords</p>
          <p className="text-gray-700">{store.metaKeywords.join(", ")}</p>
        </div>

        {/* Focus Keywords */}
        <div>
          <p className="text-sm text-gray-500">Focus Keywords</p>
          <p className="text-gray-700">{store.focusKeywords.join(", ")}</p>
        </div>

        {/* ✅ isPopular */}
        <div>
          <p className="text-sm text-gray-500">Popular</p>
          <Badge variant={store.isPopular ? "default" : "secondary"}>
            {store.isPopular ? "🔥 Popular" : "Not Popular"}
          </Badge>
        </div>

        {/* ✅ isActive */}
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <Badge variant={store.isActive ? "default" : "destructive"}>
            {store.isActive ? "✅ Active" : "❌ Inactive"}
          </Badge>
        </div>

        {/* Created At */}
        <div className="text-sm text-gray-400">
          Created: {new Date(store.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
