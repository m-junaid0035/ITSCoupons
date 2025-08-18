"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { createCouponAction } from "@/actions/couponActions";
import { fetchAllStoresAction } from "@/actions/storeActions";
import { toast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Store {
  _id: string;
  name: string;
}

interface FieldErrors {
  [key: string]: string[];
}

interface FormState {
  error?: FieldErrors | { message?: string[] };
  data?: any;
}

const initialState: FormState = { error: {} };

export default function CouponForm() {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(
    undefined
  );
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  // ---------- Added: Coupon Type State ----------
  const [couponType, setCouponType] = useState("coupon");

  // ---------- Added: Controlled Coupon Code ----------
  const [couponCode, setCouponCode] = useState("");

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      if (expirationDate) {
        formData.set("expirationDate", expirationDate.toISOString());
      }
      const result = await createCouponAction(prevState, formData);
      return result;
    },
    initialState
  );

  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as FieldErrors)[field]?.[0]
      : null;
  };

  useEffect(() => {
    fetchAllStoresAction().then((res) => {
      if (res.data && Array.isArray(res.data)) {
        setStores(res.data);
      }
    });
  }, []);

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

  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex items-center justify-between border-none">
          <CardTitle>Create Coupon</CardTitle>
          <Button
            variant="secondary"
            onClick={() => router.push("/admin/coupons")}
          >
            Back to Coupons
          </Button>
        </CardHeader>

        <CardContent>
          <form action={(formData) => dispatch(formData)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="Enter coupon title"
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
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="Enter coupon description"
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
                value={couponType} // bind state
                onChange={(e) => setCouponType(e.target.value)}
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
                defaultValue="active"
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
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="Enter coupon code"
                value={couponType === "deal" ? "DEAL_CODE" : couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={couponType === "deal"}
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
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="https://example.com/coupon"
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
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("uses") && (
                <p className="text-sm text-red-500">{errorFor("uses")}</p>
              )}
            </div>

            {/* Verified */}
            <div className="flex items-center space-x-2">
              <Input
                type="checkbox"
                id="verified"
                name="verified"
                value="true"
                className="w-4 h-4"
              />
              <Label htmlFor="verified">Verified</Label>
            </div>

            {/* Store */}
            <div className="space-y-2">
              <Label htmlFor="storeId">Store</Label>
              <select
                id="storeId"
                name="storeId"
                required
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
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="Optional store name"
              />
              {errorFor("storeName") && (
                <p className="text-sm text-red-500">{errorFor("storeName")}</p>
              )}
            </div>

            {/* Top One */}
            <div className="flex items-center space-x-2">
              <Input
                type="checkbox"
                id="isTopOne"
                name="isTopOne"
                value="true"
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

            {/* Footer */}
            <CardFooter className="flex justify-end border-none">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Saving..." : "Save Coupon"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {/* Success Confirmation Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>Coupon created successfully!</p>
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
