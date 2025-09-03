"use client";

import { useState, useEffect, startTransition } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { fetchNetworkByIdAction } from "@/actions/networkActions"; // <-- added
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import RichTextEditor from "@/components/RichTextEditor";

interface Store {
  _id: string;
  name: string;
  network?: string;
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

  const [couponType, setCouponType] = useState("coupon");
  const [couponCode, setCouponCode] = useState("");

  const [storeSearch, setStoreSearch] = useState("");
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);


  // Description HTML state
  const [descriptionHtml, setDescriptionHtml] = useState("");

  // Discount auto-extraction state
  const [discount, setDiscount] = useState("");

  // Coupon URL state (auto update on store change)
  const [couponUrl, setCouponUrl] = useState("");

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      if (expirationDate) {
        formData.set("expirationDate", expirationDate.toISOString());
      } else {
        formData.delete("expirationDate"); // ✅ allow empty expiry date
      }
      formData.set("description", descriptionHtml);
      formData.set("couponUrl", couponUrl); // <-- updated
      if (discount) {
        formData.set("discount", discount); // ✅ auto-filled discount
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

  // 🔥 Auto extract discount from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const percentMatch = value.match(/(\d+%)/); // capture e.g. 90%
    if (percentMatch) {
      setDiscount(`${percentMatch[0]} Off`);
    }
  };

  // 🔥 Auto-update couponUrl when store changes
  const handleStoreChange = async (storeId: string) => {
    const store = stores.find((s) => s._id === storeId);
    if (store?.network) {
      const netRes = await fetchNetworkByIdAction(store.network);
      if (netRes?.data?.storeNetworkUrl) {
        setCouponUrl(netRes.data.storeNetworkUrl);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (expirationDate) {
      formData.set("expirationDate", expirationDate.toISOString());
    } else {
      formData.delete("expirationDate"); // ✅ skip if empty
    }

    formData.set("description", descriptionHtml);
    formData.set("couponUrl", couponUrl); // <-- updated
    if (discount) {
      formData.set("discount", discount);
    }

    startTransition(() => dispatch(formData));
  };

  return (
    <>
      <Card className="w-full shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-none gap-2 sm:gap-0">
          <CardTitle className="text-lg sm:text-xl font-semibold">Create Coupon</CardTitle>
          <Button variant="secondary" onClick={() => router.push("/admin/coupons")}>Back to Coupons</Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                name="title"
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="Enter coupon title"
                onChange={handleTitleChange} // 🔥 auto extract discount
              />
              {errorFor("title") && (
                <p className="text-sm text-red-500">{errorFor("title")}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>
                Description
              </Label>
              <RichTextEditor value={descriptionHtml} onChange={setDescriptionHtml} height="200px" />
            </div>

            {/* Coupon Type */}
            <div className="space-y-2">
              <Label htmlFor="couponType">Coupon Type <span className="text-red-500">*</span></Label>
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
              <Label htmlFor="couponCode">Coupon Code <span className="text-red-500">*</span></Label>
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

            {/* Expiration Date (optional) */}
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
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="https://example.com/coupon"
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

            {/* Store with Search */}
            <div className="space-y-2">
              <Label htmlFor="storeId">Store <span className="text-red-500">*</span></Label>

              <div className="relative">
                {/* Search Input */}
                <Input
                  placeholder="Search store..."
                  value={storeSearch}
                  onFocus={() => setStoreDropdownOpen(true)}
                  onChange={(e) => setStoreSearch(e.target.value)}
                  required
                />

                {/* Dropdown List */}
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
                            setSelectedStore(store);       // save selected store
                            setStoreSearch(store.name);    // show name in input
                            setStoreDropdownOpen(false);   // close dropdown
                            handleStoreChange(store._id);  // keep your old logic (auto-fill couponUrl, etc.)
                          }}
                        >
                          {store.name}
                        </div>
                      ))}

                    {/* No results */}
                    {stores.filter((s) =>
                      s.name.toLowerCase().includes(storeSearch.toLowerCase())
                    ).length === 0 && (
                        <div className="px-4 py-2 text-gray-500">No stores found</div>
                      )}
                  </div>
                )}
              </div>

              {/* Hidden field to submit selected storeId */}
              <input type="hidden" name="storeId" value={selectedStore?._id || ""} required />
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