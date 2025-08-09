import { fetchCouponByIdAction } from "@/actions/couponActions";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface CouponViewPageProps {
  params: { id: string };
}

export default async function CouponViewPage({ params }: CouponViewPageProps) {
  const result = await fetchCouponByIdAction(params.id);

  if (!result || result.error || !result.data) return notFound();

  const coupon = result.data;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">View Coupon</h2>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <p className="text-sm text-gray-500">Title</p>
          <p className="text-lg font-medium">{coupon.title}</p>
        </div>

        {/* Coupon Code */}
        <div>
          <p className="text-sm text-gray-500">Coupon Code</p>
          <p className="text-lg font-medium">{coupon.couponCode}</p>
        </div>

        {/* Coupon Type */}
        <div>
          <p className="text-sm text-gray-500">Coupon Type</p>
          <Badge>{coupon.couponType}</Badge>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <Badge className={coupon.status === "active" ? "bg-green-500" : "bg-red-500"}>
            {coupon.status}
          </Badge>
        </div>

        {/* Top One */}
        <div>
          <p className="text-sm text-gray-500">Top One</p>
          <Badge className={coupon.isTopOne ? "bg-blue-600" : "bg-gray-400"}>
            {coupon.isTopOne ? "Yes" : "No"}
          </Badge>
        </div>

        {/* Store Name */}
        <div>
          <p className="text-sm text-gray-500">Store Name</p>
          <p className="text-lg font-medium">{coupon.storeName || "N/A"}</p>
        </div>

        {/* Store ID */}
        <div>
          <p className="text-sm text-gray-500">Store ID</p>
          <p className="text-lg text-gray-700">{coupon.storeId}</p>
        </div>

        {/* Description */}
        {coupon.description && (
          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="text-gray-700">{coupon.description}</p>
          </div>
        )}

        {/* Coupon URL */}
        {coupon.couponUrl && (
          <div>
            <p className="text-sm text-gray-500">Coupon URL</p>
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
          <p className="text-sm text-gray-500">Expiration Date</p>
          <p className="text-lg text-gray-700">
            {new Date(coupon.expirationDate).toLocaleString()}
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
