"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchAllCouponsAction,
  deleteCouponAction,
} from "@/actions/couponActions";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ICoupon {
  _id: string;
  title: string;
  couponCode: string;
  couponType: "deal" | "coupon";
  status: "active" | "expired";
  expirationDate: string;
  storeName?: string;
  isTopOne?: boolean;
}

export default function CouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadCoupons() {
    setLoading(true);
    const result = await fetchAllCouponsAction();

    if (result.data && Array.isArray(result.data)) {
      setCoupons(result.data as ICoupon[]);
    } else {
      console.error("Failed to fetch coupons", result.error);
    }

    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    setLoading(true);

    const result = await deleteCouponAction(id);

    if (result.error) {
      alert(result.error.message?.[0] || "Failed to delete coupon");
    } else {
      await loadCoupons();
    }

    setLoading(false);
  }

  useEffect(() => {
    loadCoupons();
  }, []);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Coupons</CardTitle>
        <Button onClick={() => router.push("/admin/coupons/new")}>
          Create Coupon
        </Button>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Code</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Expires</th>
                <th className="p-2 text-left">Store</th>
                <th className="p-2 text-left">Top One</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="border-b hover:bg-muted/50">
                    <td className="p-2">{coupon.title}</td>
                    <td className="p-2">{coupon.couponCode}</td>
                    <td className="p-2 capitalize">{coupon.couponType}</td>
                    <td className="p-2 capitalize">{coupon.status}</td>
                    <td className="p-2">
                      {new Date(coupon.expirationDate).toLocaleDateString()}
                    </td>
                    <td className="p-2">{coupon.storeName || "-"}</td>
                    <td className="p-2">
                      {coupon.isTopOne ? (
                        <span className="text-green-600 font-semibold">Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="p-2 space-x-2">
                      <Button
                        variant="secondary"
                        onClick={() => router.push(`/admin/coupons/view/${coupon._id}`)}
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => router.push(`/admin/coupons/edit/${coupon._id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(coupon._id)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-muted-foreground">
                    No coupons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
