"use client";

import { useState, useEffect, startTransition } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import RichTextEditor from "@/components/RichTextEditor";
import { toast } from "@/hooks/use-toast";

import { createCouponAction } from "@/actions/couponActions";

interface Store {
  _id: string;
  name: string;
  network?: string;
  storeNetworkUrl?: string;
  directUrl?: string;
}

interface FieldErrors {
  [key: string]: string[];
}

interface FormState {
  error?: FieldErrors | { message?: string[] };
  data?: any;
}

const initialState: FormState = { error: {} };

interface CouponFormClientProps {
  stores: Store[];
}

export default function CouponFormClient({ stores }: CouponFormClientProps) {
  const router = useRouter();

  const [expirationDate, setExpirationDate] = useState<Date | undefined>();
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const [couponType, setCouponType] = useState("coupon");
  const [couponCode, setCouponCode] = useState("");

  const [storeSearch, setStoreSearch] = useState("");
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const [descriptionHtml, setDescriptionHtml] = useState("");
  const [discount, setDiscount] = useState("");
  const [couponUrl, setCouponUrl] = useState("");

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      if (expirationDate) {
        formData.set("expirationDate", expirationDate.toISOString());
      } else {
        formData.delete("expirationDate");
      }

      formData.set("description", descriptionHtml);
      formData.set("couponUrl", couponUrl);
      if (discount) {
        formData.set("discount", discount);
      }

      return await createCouponAction(prevState, formData);
    },
    initialState
  );

  const errorFor = (field: string) =>
    formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as FieldErrors)[field]?.[0]
      : null;

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

  // 🔥 Auto extract discount from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const percentMatch = value.match(/(\d+%)/);
    if (percentMatch) {
      setDiscount(`${percentMatch[0]} Off`);
    }
  };

  // 🔥 Auto-update couponUrl when store changes
  const handleStoreChange = async (storeId: string) => {
    const store = stores.find((s) => s._id === storeId);
    if (store?.network) {
        setCouponUrl(store?.storeNetworkUrl ?? "");
    } else if (store?.directUrl) {
      setCouponUrl(store?.directUrl);
    }

  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (expirationDate) {
      formData.set("expirationDate", expirationDate.toISOString());
    } else {
      formData.delete("expirationDate");
    }

    formData.set("description", descriptionHtml);
    formData.set("couponUrl", couponUrl);
    if (discount) {
      formData.set("discount", discount);
    }

    startTransition(() => dispatch(formData));
  };

  return (
    <>
      <Card className="w-full shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-none gap-2 sm:gap-0">
          <CardTitle className="text-lg sm:text-xl font-semibold">
            Create Coupon
          </CardTitle>
          <Button variant="secondary" onClick={() => router.push("/admin/coupons")}>
            Back to Coupons
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="Enter coupon title"
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                onChange={handleTitleChange}
              />
              {errorFor("title") && (
                <p className="text-sm text-red-500">{errorFor("title")}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <RichTextEditor value={descriptionHtml} onChange={setDescriptionHtml} height="200px" />
            </div>

            {/* Coupon Type */}
            <div className="space-y-2">
              <Label htmlFor="couponType">
                Coupon Type <span className="text-red-500">*</span>
              </Label>
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
              <Label htmlFor="couponCode">
                Coupon Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="couponCode"
                name="couponCode"
                value={couponType === "deal" ? "NO_CODE" : couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={couponType === "deal"}
              />
              {couponType === "deal" && (
                <input type="hidden" name="couponCode" value="NO_CODE" />
              )}
            </div>

            {/* Expiration Date */}
            <div className="space-y-2">
              <Label>Expiration Date (optional)</Label>
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
                    {expirationDate ? format(expirationDate, "PPP") : "No expiry date"}
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
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setExpirationDate(undefined)}
              >
                Clear Date
              </Button>
            </div>

            {/* Coupon URL */}
            <div className="space-y-2">
              <Label htmlFor="couponUrl">Coupon URL (auto-filled)</Label>
              <Input
                id="couponUrl"
                name="couponUrl"
                type="url"
                value={couponUrl}
                onChange={(e) => setCouponUrl(e.target.value)}
                placeholder="https://example.com/coupon"
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
            </div>

            {/* Discount */}
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (auto-filled)</Label>
              <Input
                id="discount"
                name="discount"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="e.g. 20% Off"
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
                className="w-4 h-4"
              />
              <Label htmlFor="verified">Verified</Label>
            </div>

            {/* Store Search & Select */}
            <div className="space-y-2">
              <Label htmlFor="storeId">
                Store <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  placeholder="Search store..."
                  value={storeSearch}
                  onFocus={() => setStoreDropdownOpen(true)}
                  onChange={(e) => setStoreSearch(e.target.value)}
                  required
                />

                {storeDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border rounded shadow max-h-60 overflow-y-auto">
                    {stores
                      .filter((s) =>
                        s.name.toLowerCase().includes(storeSearch.toLowerCase())
                      )
                      .map((store) => (
                        <div
                          key={store._id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => {
                            setSelectedStore(store);
                            setStoreSearch(store.name);
                            setStoreDropdownOpen(false);
                            handleStoreChange(store._id);
                          }}
                        >
                          {store.name}
                        </div>
                      ))}

                    {stores.filter((s) =>
                      s.name.toLowerCase().includes(storeSearch.toLowerCase())
                    ).length === 0 && (
                        <div className="px-4 py-2 text-gray-500">No stores found</div>
                      )}
                  </div>
                )}
              </div>
              <input type="hidden" name="storeId" value={selectedStore?._id || ""} required />
            </div>

            {/* Store Name */}
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name (optional)</Label>
              <Input
                id="storeName"
                name="storeName"
                placeholder="Optional store name"
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
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

            <CardFooter className="flex justify-end border-none">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Saving..." : "Save Coupon"}
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
