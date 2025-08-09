"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useActionState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

import { format } from "date-fns";

import { updateCouponAction, fetchCouponByIdAction } from "@/actions/couponActions";
import { fetchAllStoresAction } from "@/actions/storeActions";

interface FormState {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
}

const initialState: FormState = {
  error: {},
};

interface Store {
  _id: string;
  name: string;
}

export default function EditCouponForm() {
  const params = useParams();
  const couponId = params.id as string;

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) =>
      await updateCouponAction(prevState, couponId, formData),
    initialState
  );

  const [coupon, setCoupon] = useState<any>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    async function loadData() {
      const [couponRes, storeRes] = await Promise.all([
        fetchCouponByIdAction(couponId),
        fetchAllStoresAction(),
      ]);

      if (couponRes?.data) {
        setCoupon(couponRes.data);
        if (couponRes.data.expirationDate)
          setExpirationDate(new Date(couponRes.data.expirationDate));
      }

      if (storeRes?.data) setStores(storeRes.data);
      setLoading(false);
    }

    loadData();
  }, [couponId]);

  if (loading) return <p>Loading...</p>;
  if (!coupon) return <p className="text-red-500">Coupon not found</p>;

  const errorFor = (field: string) =>
    formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;

  return (
    <form
      action={(formData) => {
        if (expirationDate) {
          formData.set("expirationDate", expirationDate.toISOString());
        }
        return dispatch(formData);
      }}
      className="space-y-6 max-w-2xl"
    >
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={coupon.title} required />
        {errorFor("title") && <p className="text-sm text-red-500">{errorFor("title")}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} defaultValue={coupon.description} />
        {errorFor("description") && (
          <p className="text-sm text-red-500">{errorFor("description")}</p>
        )}
      </div>

      {/* Coupon Type */}
      <div className="space-y-2">
        <Label htmlFor="couponType">Coupon Type</Label>
        <select
          id="couponType"
          name="couponType"
          className="w-full border rounded px-3 py-2"
          defaultValue={coupon.couponType}
        >
          <option value="coupon">Coupon</option>
          <option value="deal">Deal</option>
        </select>
        {errorFor("couponType") && (
          <p className="text-sm text-red-500">{errorFor("couponType")}</p>
        )}
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          className="w-full border rounded px-3 py-2"
          defaultValue={coupon.status}
        >
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
        {errorFor("status") && (
          <p className="text-sm text-red-500">{errorFor("status")}</p>
        )}
      </div>

      {/* Coupon Code */}
      <div className="space-y-2">
        <Label htmlFor="couponCode">Coupon Code</Label>
        <Input id="couponCode" name="couponCode" defaultValue={coupon.couponCode} required />
        {errorFor("couponCode") && (
          <p className="text-sm text-red-500">{errorFor("couponCode")}</p>
        )}
      </div>

      {/* Expiration Date */}
      <div className="space-y-2">
        <Label>Expiration Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !expirationDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {expirationDate ? format(expirationDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={expirationDate}
              onSelect={setExpirationDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errorFor("expirationDate") && (
          <p className="text-sm text-red-500">{errorFor("expirationDate")}</p>
        )}
      </div>

      {/* Coupon URL */}
      <div className="space-y-2">
        <Label htmlFor="couponUrl">Coupon URL</Label>
        <Input
          id="couponUrl"
          name="couponUrl"
          type="url"
          defaultValue={coupon.couponUrl}
        />
        {errorFor("couponUrl") && (
          <p className="text-sm text-red-500">{errorFor("couponUrl")}</p>
        )}
      </div>

      {/* Store Dropdown */}
      <div className="space-y-2">
        <Label htmlFor="storeId">Store</Label>
        <select
          id="storeId"
          name="storeId"
          defaultValue={coupon.storeId}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select a store</option>
          {stores.map((store) => (
            <option key={store._id} value={store._id}>
              {store.name}
            </option>
          ))}
        </select>
        {errorFor("storeId") && (
          <p className="text-sm text-red-500">{errorFor("storeId")}</p>
        )}
      </div>

      {/* Store Name */}
      <div className="space-y-2">
        <Label htmlFor="storeName">Store Name (optional)</Label>
        <Input id="storeName" name="storeName" defaultValue={coupon.storeName || ""} />
        {errorFor("storeName") && (
          <p className="text-sm text-red-500">{errorFor("storeName")}</p>
        )}
      </div>

      {/* Is Top One */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isTopOne"
          name="isTopOne"
          value="true"
          defaultChecked={coupon.isTopOne}
          className="w-4 h-4"
        />
        <Label htmlFor="isTopOne">Mark as Top One</Label>
      </div>


      {/* Submit */}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update Coupon"}
      </Button>

      {/* General Error */}
      {"message" in (formState.error || {}) && (
        <p className="text-sm text-red-500">
          {(formState.error as { message?: string[] }).message?.[0]}
        </p>
      )}
    </form>
  );
}
