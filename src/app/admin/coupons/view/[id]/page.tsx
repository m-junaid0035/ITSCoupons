import { fetchCouponByIdAction } from "@/actions/couponActions";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default async function CouponViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await fetchCouponByIdAction(id);

  if (!result || result.error || !result.data) return notFound();

  const coupon = result.data;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">View Coupon</h2>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Title</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{coupon.title}</p>
        </div>

        {/* Coupon Code */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Coupon Code</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{coupon.couponCode}</p>
        </div>

        {/* Coupon Type */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Coupon Type</p>
          <Badge>{coupon.couponType}</Badge>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
          <Badge className={coupon.status === "active" ? "bg-green-500" : "bg-red-500"}>
            {coupon.status}
          </Badge>
        </div>

        {/* Top One */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Top One</p>
          <Badge className={coupon.isTopOne ? "bg-blue-600" : "bg-gray-400"}>
            {coupon.isTopOne ? "Yes" : "No"}
          </Badge>
        </div>

        {/* Store Name */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Store Name</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{coupon.storeName || "N/A"}</p>
        </div>

        {/* Store ID */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Store ID</p>
          <p className="text-lg text-gray-700 dark:text-gray-300">{coupon.storeId}</p>
        </div>

        {/* Description */}
        {coupon.description && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
            <div
              className="prose prose-purple dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: coupon.description }}
            />
          </div>
        )}


        {/* Coupon URL */}
        {coupon.couponUrl && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Coupon URL</p>
            <a
              href={coupon.couponUrl}
              target="_blank"
              className="text-blue-600 underline break-all"
              rel="noreferrer"
            >
              {coupon.couponUrl}
            </a>
          </div>
        )}

        {/* Expiration Date */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Expiration Date</p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {coupon.expirationDate
              ? new Date(coupon.expirationDate).toLocaleString()
              : "N/A"}
          </p>
        </div>

        {/* Created At */}
        {coupon.createdAt && (
          <div className="text-sm text-gray-400">
            Created: {new Date(coupon.createdAt).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
