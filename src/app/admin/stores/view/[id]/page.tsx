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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">View Store</h2>

      <div className="space-y-4">
        {/* Store Name */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Store Name</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{store.name || "N/A"}</p>
        </div>

        {/* Store Network URL */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Store Network URL</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{store.storeNetworkUrl || "N/A"}</p>
        </div>

        {/* Categories */}
        <div>
          <p className="text-sm text-gray-500 mb-1 dark:text-gray-400">Categories</p>
          <div className="flex flex-wrap gap-2">
            {store.categories?.length > 0 ? (
              store.categories.map((cat: string) => (
                <Badge key={cat}>{cat}</Badge>
              ))
            ) : (
              <span className="text-gray-400 dark:text-gray-500">None</span>
            )}
          </div>
        </div>

        {/* Image */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Image</p>
          {store.image ? (
            <img
              src={store.image}
              alt="Store"
              className="w-32 h-32 object-cover rounded"
            />
          ) : (
            <p className="text-gray-400 dark:text-gray-500">No image</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Slug</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{store.slug || "N/A"}</p>
        </div>

        {/* Total Coupon Used Times */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Coupon Used Times</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{store.totalCouponUsedTimes ?? 0}</p>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
          <p className="text-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{store.description || "N/A"}</p>
        </div>

        {/* Meta Title */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Meta Title</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{store.metaTitle || "N/A"}</p>
        </div>

        {/* Meta Description */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Meta Description</p>
          <p className="text-gray-700 dark:text-gray-300">{store.metaDescription || "N/A"}</p>
        </div>

        {/* Meta Keywords */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Meta Keywords</p>
          <p className="text-gray-700 dark:text-gray-300">
            {(store.metaKeywords?.length ?? 0) > 0 ? store.metaKeywords.join(", ") : "N/A"}
          </p>
        </div>

        {/* Focus Keywords */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Focus Keywords</p>
          <p className="text-gray-700 dark:text-gray-300">
            {(store.focusKeywords?.length ?? 0) > 0 ? store.focusKeywords.join(", ") : "N/A"}
          </p>
        </div>

        {/* Popular */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Popular</p>
          <Badge variant={store.isPopular ? "default" : "secondary"}>
            {store.isPopular ? "🔥 Popular" : "Not Popular"}
          </Badge>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
          <Badge variant={store.isActive ? "default" : "destructive"}>
            {store.isActive ? "✅ Active" : "❌ Inactive"}
          </Badge>
        </div>

        {/* Created At */}
        <div className="text-sm text-gray-400 dark:text-gray-500">
          Created: {store.createdAt ? new Date(store.createdAt).toLocaleString() : "N/A"}
        </div>
      </div>
    </div>
  );
}
