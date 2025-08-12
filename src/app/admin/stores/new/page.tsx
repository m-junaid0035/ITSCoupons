"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react"; // adjust import if needed
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { createStoreAction } from "@/actions/storeActions";
import { fetchAllCategoriesAction } from "@/actions/categoryActions";

interface FormState {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
}

const initialState: FormState = {
  error: {},
};

interface Category {
  _id: string;
  name: string;
}

export default function StoreForm() {
  const router = useRouter();
  const [formState, dispatch, isPending] = useActionState(
    createStoreAction,
    initialState
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      const result = await fetchAllCategoriesAction();
      if (result.data && Array.isArray(result.data)) {
        setCategories(result.data);
      }
    }
    loadCategories();
  }, []);

  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;
  };

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
      <Card className="max-w-3xl mx-auto shadow-lg bg-white">
        <CardHeader className="flex items-center justify-between border-none">
          <CardTitle>Create Store</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={dispatch} id="store-form" className="space-y-6 max-w-2xl mx-auto">
            {/* Store Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Store Name</Label>
              <Input id="name" name="name" required className="border-none shadow-sm" />
              {errorFor("name") && (
                <p className="text-sm text-red-500">{errorFor("name")}</p>
              )}
            </div>

            {/* Store Network URL */}
            <div className="space-y-2">
              <Label htmlFor="storeNetworkUrl">Store Network URL</Label>
              <Input
                id="storeNetworkUrl"
                name="storeNetworkUrl"
                type="url"
                required
                className="border-none shadow-sm"
              />
              {errorFor("storeNetworkUrl") && (
                <p className="text-sm text-red-500">{errorFor("storeNetworkUrl")}</p>
              )}
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <label key={cat._id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="categories"
                      value={cat._id}
                      className="h-4 w-4"
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
              {errorFor("categories") && (
                <p className="text-sm text-red-500">{errorFor("categories")}</p>
              )}
            </div>

            {/* Total Coupon Used Times */}
            <div className="space-y-2">
              <Label htmlFor="totalCouponUsedTimes">Total Coupon Used Times</Label>
              <Input
                id="totalCouponUsedTimes"
                name="totalCouponUsedTimes"
                type="number"
                defaultValue={0}
                className="border-none shadow-sm"
              />
              {errorFor("totalCouponUsedTimes") && (
                <p className="text-sm text-red-500">{errorFor("totalCouponUsedTimes")}</p>
              )}
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                type="url"
                required
                className="border-none shadow-sm"
              />
              {errorFor("image") && (
                <p className="text-sm text-red-500">{errorFor("image")}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                required
                className="border-none shadow-sm"
              />
              {errorFor("description") && (
                <p className="text-sm text-red-500">{errorFor("description")}</p>
              )}
            </div>

            {/* Meta Title */}
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                name="metaTitle"
                required
                className="border-none shadow-sm"
              />
              {errorFor("metaTitle") && (
                <p className="text-sm text-red-500">{errorFor("metaTitle")}</p>
              )}
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                name="metaDescription"
                rows={3}
                required
                className="border-none shadow-sm"
              />
              {errorFor("metaDescription") && (
                <p className="text-sm text-red-500">{errorFor("metaDescription")}</p>
              )}
            </div>

            {/* Meta Keywords */}
            <div className="space-y-2">
              <Label htmlFor="metaKeywords">Meta Keywords (comma separated)</Label>
              <Input
                id="metaKeywords"
                name="metaKeywords"
                className="border-none shadow-sm"
              />
              {errorFor("metaKeywords") && (
                <p className="text-sm text-red-500">{errorFor("metaKeywords")}</p>
              )}
            </div>

            {/* Focus Keywords */}
            <div className="space-y-2">
              <Label htmlFor="focusKeywords">Focus Keywords (comma separated)</Label>
              <Input
                id="focusKeywords"
                name="focusKeywords"
                className="border-none shadow-sm"
              />
              {errorFor("focusKeywords") && (
                <p className="text-sm text-red-500">{errorFor("focusKeywords")}</p>
              )}
            </div>

            {/* isPopular */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isPopular"
                  className="h-4 w-4"
                />
                <span>Mark as Popular</span>
              </label>
            </div>

            {/* isActive */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked
                  className="h-4 w-4"
                />
                <span>Mark as Active</span>
              </label>
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" required className="border-none shadow-sm" />
              {errorFor("slug") && (
                <p className="text-sm text-red-500">{errorFor("slug")}</p>
              )}
            </div>

            {/* General Error */}
            {"message" in (formState.error ?? {}) && (
              <p className="text-sm text-red-500">{(formState.error as any).message?.[0]}</p>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex justify-end border-none">
          <Button type="submit" disabled={isPending} form="store-form">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Saving..." : "Save Store"}
          </Button>
        </CardFooter>
      </Card>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>Store created successfully!</p>
          <DialogFooter>
            <Button
              onClick={() => {
                setSuccessDialogOpen(false);
                router.push("/admin/stores");
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
