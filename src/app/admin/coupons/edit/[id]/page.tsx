"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActionState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import LoadingSkeleton from "./loading"; // Your loading skeleton component
import { toast } from "@/hooks/use-toast";

import { updateCouponAction, fetchCouponByIdAction } from "@/actions/couponActions";
import { fetchAllStoresAction } from "@/actions/storeActions";

interface FormState {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
}

interface Store {
  _id: string;
  name: string;
}

const initialState: FormState = {
  error: {},
};

export default function EditCouponForm() {
  const params = useParams();
  const router = useRouter();
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
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
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
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [couponId]);

  useEffect(() => {
    if (formState.data && !formState.error) {
      setSuccessDialogOpen(true);
    }
    if (formState.error && "message" in formState.error) {
      toast({
        title: "Error",
        description:
          (formState.error as any).message?.[0] || "Something went wrong",
        variant: "destructive",
      });
    }
  }, [formState]);

  if (loading) return <LoadingSkeleton />;

  if (!coupon)
    return (
      <p className="text-red-500 text-center mt-4">Coupon not found</p>
    );

  const errorFor = (field: string) =>
    formState.error &&
    typeof formState.error === "object" &&
    field in formState.error
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;

  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex items-center justify-between border-none">
          <CardTitle>Edit Coupon</CardTitle>
          <Button variant="secondary" onClick={() => router.push("/admin/coupons")}>
            Back to Coupons
          </Button>
        </CardHeader>

        <CardContent>
          <form
            action={(formData) => {
              if (expirationDate) {
                formData.set("expirationDate", expirationDate.toISOString());
              }
              return dispatch(formData);
            }}
            className="space-y-6 max-w-xl mx-auto"
          >
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={coupon.title}
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("title") && (
                <p className="text-sm text-red-500">{errorFor("title")}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={coupon.description}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
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
                defaultValue={coupon.couponType}
                className="w-full rounded px-3 py-2 shadow-sm border-none bg-gray-50 dark:bg-gray-700"
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
                defaultValue={coupon.status}
                className="w-full rounded px-3 py-2 shadow-sm border-none bg-gray-50 dark:bg-gray-700"
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
              <Input
                id="couponCode"
                name="couponCode"
                defaultValue={coupon.couponCode}
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
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
                      "w-full justify-start text-left font-normal border-none shadow-sm bg-gray-50 dark:bg-gray-700",
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
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("couponUrl") && (
                <p className="text-sm text-red-500">{errorFor("couponUrl")}</p>
              )}
            </div>

            {/* Discount */}
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (optional)</Label>
              <Input
                id="discount"
                name="discount"
                placeholder="e.g. 20% off"
                defaultValue={coupon.discount || ""}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("discount") && (
                <p className="text-sm text-red-500">{errorFor("discount")}</p>
              )}
            </div>

            {/* Uses */}
            <div className="space-y-2">
              <Label htmlFor="uses">Uses (optional)</Label>
              <Input
                id="uses"
                name="uses"
                type="number"
                min={0}
                placeholder="Number of uses"
                defaultValue={coupon.uses !== undefined ? String(coupon.uses) : ""}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("uses") && (
                <p className="text-sm text-red-500">{errorFor("uses")}</p>
              )}
            </div>

            {/* Verified */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="verified"
                name="verified"
                value="true"
                defaultChecked={!!coupon.verified}
                className="w-4 h-4"
              />
              <Label htmlFor="verified">Verified</Label>
            </div>

            {/* Store Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="storeId">Store</Label>
              <select
                id="storeId"
                name="storeId"
                defaultValue={coupon.storeId}
                className="w-full rounded px-3 py-2 shadow-sm border-none bg-gray-50 dark:bg-gray-700"
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
              <Input
                id="storeName"
                name="storeName"
                defaultValue={coupon.storeName || ""}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
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

            {/* General Error */}
            {"message" in (formState.error ?? {}) && (
              <p className="text-sm text-red-500">
                {(formState.error as any).message?.[0]}
              </p>
            )}

            <CardFooter className="flex justify-end border-none px-0 pt-0">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Updating..." : "Update Coupon"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>Coupon updated successfully!</p>
          <DialogFooter>
            <Button
              onClick={() => {
                setSuccessDialogOpen(false);
                router.push("/admin/coupons");
              }}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
