"use client";

import { useEffect, useState, startTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActionState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

import LoadingSkeleton from "./loading";
import { toast } from "@/hooks/use-toast";

import { updateCouponAction, fetchCouponByIdAction } from "@/actions/couponActions";
import { fetchAllStoresAction } from "@/actions/storeActions";
import DescriptionEditor from "@/components/DescriptionEditor"; // Rich text editor

interface FormState {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
}

interface Store {
  _id: string;
  name: string;
}

const initialState: FormState = { error: {} };

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

  // Coupon type and code
  const [couponType, setCouponType] = useState("coupon");
  const [couponCode, setCouponCode] = useState("");

  // Description editor state
  const [descriptionHtml, setDescriptionHtml] = useState("");
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [couponRes, storeRes] = await Promise.all([
          fetchCouponByIdAction(couponId),
          fetchAllStoresAction(),
        ]);
        if (couponRes?.data) {
          setCoupon(couponRes.data);
          setCouponType(couponRes.data.couponType || "coupon");
          setCouponCode(couponRes.data.couponCode || "");
          setDescriptionHtml(couponRes.data.description || "");
          if (couponRes.data.expirationDate)
            setExpirationDate(new Date(couponRes.data.expirationDate));
        }
        if (storeRes?.data) setStores(storeRes.data);
      } catch {
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
    return <p className="text-red-500 text-center mt-4">Coupon not found</p>;

  const errorFor = (field: string) =>
    formState.error &&
    typeof formState.error === "object" &&
    field in formState.error
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (expirationDate)
      formData.set("expirationDate", expirationDate.toISOString());
    formData.set("description", descriptionHtml);
    if (couponType === "deal") formData.set("couponCode", "DEAL_CODE");

    startTransition(() => dispatch(formData));
  };

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
          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
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
              {errorFor("title") && <p className="text-sm text-red-500">{errorFor("title")}</p>}
            </div>

            {/* Description with Rich Editor */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Button type="button" onClick={() => setDescriptionModalOpen(true)}>
                {descriptionHtml ? "Edit Description" : "Add Description"}
              </Button>
              {errorFor("description") && <p className="text-sm text-red-500">{errorFor("description")}</p>}
            </div>

            {/* Coupon Type */}
            <div className="space-y-2">
              <Label htmlFor="couponType">Coupon Type</Label>
              <select
                id="couponType"
                name="couponType"
                value={couponType}
                onChange={(e) => setCouponType(e.target.value)}
                className="w-full rounded px-3 py-2 shadow-sm border-none bg-gray-50 dark:bg-gray-700"
              >
                <option value="coupon">Coupon</option>
                <option value="deal">Deal</option>
              </select>
            </div>

            {/* Coupon Code */}
            <div className="space-y-2">
              <Label htmlFor="couponCode">Coupon Code</Label>
              <Input
                id="couponCode"
                name="couponCode"
                value={couponType === "deal" ? "DEAL_CODE" : couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={couponType === "deal"}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {couponType === "deal" && (
                <input type="hidden" name="couponCode" value="DEAL_CODE" />
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
            </div>

            {/* Verified */}
            <div className="flex items-center space-x-2">
              <Input
                type="checkbox"
                id="verified"
                name="verified"
                value="true"
                defaultChecked={!!coupon.verified}
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
            </div>

            {/* Is Top One */}
            <div className="flex items-center space-x-2">
              <Input
                type="checkbox"
                id="isTopOne"
                name="isTopOne"
                value="true"
                defaultChecked={coupon.isTopOne}
                className="w-4 h-4"
              />
              <Label htmlFor="isTopOne">Mark as Top One</Label>
            </div>

            <CardFooter className="flex justify-end border-none px-0 pt-0">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Updating..." : "Update Coupon"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {/* Description Editor Modal */}
      <Dialog open={descriptionModalOpen} onOpenChange={setDescriptionModalOpen}>
        <DialogContent className="max-w-3xl w-full">
          <DialogHeader>
            <DialogTitle>Edit Description</DialogTitle>
          </DialogHeader>
          <DescriptionEditor
            initialContent={descriptionHtml}
            onChange={setDescriptionHtml}
          />
          <DialogFooter className="space-x-2">
            <Button variant="outline" onClick={() => setDescriptionModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setDescriptionModalOpen(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
