"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import { createCouponAction } from "@/actions/couponActions";
import { fetchAllStoresAction } from "@/actions/storeActions";

interface Store {
  _id: string;
  name: string;
}

export default function CouponForm() {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined);

  const initialState = { error: {} };
  const [formState, dispatch, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      if (expirationDate) {
        formData.set("expirationDate", expirationDate.toISOString());
      }
      const result = await createCouponAction(prevState, formData);
      if (!result.error || Object.keys(result.error).length === 0) {
        router.push("/coupons");
      }
      return result;
    },
    initialState
  );

  useEffect(() => {
    fetchAllStoresAction().then((res) => {
      if (res.data && Array.isArray(res.data)) {
        setStores(res.data);
      }
    });
  }, []);

  return (
    <Card className="max-w-4xl mx-auto shadow-lg bg-white">
      <CardHeader className="flex items-center justify-between border-none">
        <CardTitle>Create Coupon</CardTitle>
        <Button variant="secondary" onClick={() => router.push("/coupons")}>
          Back to Coupons
        </Button>
      </CardHeader>

      <CardContent>
        <form action={dispatch} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required className="border-none shadow-sm" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} className="border-none shadow-sm" />
          </div>

          {/* Coupon Type */}
          <div className="space-y-2">
            <Label htmlFor="couponType">Coupon Type</Label>
            <select id="couponType" name="couponType" defaultValue="coupon" className="w-full rounded px-3 py-2 shadow-sm border-none bg-white">
              <option value="coupon">Coupon</option>
              <option value="deal">Deal</option>
            </select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select id="status" name="status" defaultValue="active" className="w-full rounded px-3 py-2 shadow-sm border-none bg-white">
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Coupon Code */}
          <div className="space-y-2">
            <Label htmlFor="couponCode">Coupon Code</Label>
            <Input id="couponCode" name="couponCode" required className="border-none shadow-sm" />
          </div>

          {/* Expiration Date */}
          <div className="space-y-2">
            <Label>Expiration Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal border-none shadow-sm", !expirationDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expirationDate ? format(expirationDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={expirationDate} onSelect={setExpirationDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Coupon URL */}
          <div className="space-y-2">
            <Label htmlFor="couponUrl">Coupon URL</Label>
            <Input id="couponUrl" name="couponUrl" type="url" className="border-none shadow-sm" />
          </div>

          {/* Discount */}
          <div className="space-y-2">
            <Label htmlFor="discount">Discount (optional)</Label>
            <Input id="discount" name="discount" placeholder="e.g. 20% off" className="border-none shadow-sm" />
          </div>

          {/* Uses */}
          <div className="space-y-2">
            <Label htmlFor="uses">Uses (optional)</Label>
            <Input id="uses" name="uses" type="number" min={0} placeholder="Number of uses" className="border-none shadow-sm" />
          </div>

          {/* Verified */}
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="verified" name="verified" value="true" className="w-4 h-4" />
            <Label htmlFor="verified">Verified</Label>
          </div>

          {/* Store */}
          <div className="space-y-2">
            <Label htmlFor="storeId">Store</Label>
            <select id="storeId" name="storeId" required className="w-full rounded px-3 py-2 shadow-sm border-none bg-white">
              <option value="">Select a store</option>
              {stores.map((store) => (
                <option key={store._id} value={store._id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          {/* Store Name */}
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name (optional)</Label>
            <Input id="storeName" name="storeName" className="border-none shadow-sm" />
          </div>

          {/* Top One */}
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="isTopOne" name="isTopOne" value="true" className="w-4 h-4" />
            <Label htmlFor="isTopOne">Mark as Top One</Label>
          </div>

          {/* Footer */}
          <CardFooter className="flex justify-end border-none px-0">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Saving..." : "Save Coupon"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
