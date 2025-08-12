"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActionState } from "react";

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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import LoadingSkeleton from "./loading";
import { toast } from "@/hooks/use-toast";

import {
  fetchStoreByIdAction,
  updateStoreAction,
} from "@/actions/storeActions";

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

export default function EditStoreForm() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.id as string;

  const [store, setStore] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) =>
      await updateStoreAction(prevState, storeId, formData),
    initialState
  );

  useEffect(() => {
    async function loadData() {
      const [storeRes, categoriesRes] = await Promise.all([
        fetchStoreByIdAction(storeId),
        fetchAllCategoriesAction(),
      ]);

      if (storeRes?.data) setStore(storeRes.data);
      if (categoriesRes?.data) setCategories(categoriesRes.data);

      setLoading(false);
    }

    loadData();
  }, [storeId]);

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

  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;
  };

  if (loading)
    return (
      <LoadingSkeleton/>
    );

  if (!store)
    return <p className="max-w-3xl mx-auto text-red-500">Store not found</p>;

  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg bg-white">
        <CardHeader className="flex items-center justify-between border-none">
          <CardTitle>Edit Store</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={dispatch} id="edit-store-form" className="space-y-6 max-w-2xl mx-auto">
            {/* Store Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Store Name</Label>
              <Input id="name" name="name" defaultValue={store.name} required className="border-none shadow-sm" />
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
                defaultValue={store.storeNetworkUrl}
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
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {categories.map((cat) => (
                  <label key={cat._id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="categories"
                      value={cat._id}
                      className="h-4 w-4"
                      defaultChecked={store.categories?.includes(cat._id)}
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
                defaultValue={store.totalCouponUsedTimes ?? 0}
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
                defaultValue={store.image}
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
                defaultValue={store.description}
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
                defaultValue={store.metaTitle}
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
                defaultValue={store.metaDescription}
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
                defaultValue={store.metaKeywords}
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
                defaultValue={store.focusKeywords}
                className="border-none shadow-sm"
              />
              {errorFor("focusKeywords") && (
                <p className="text-sm text-red-500">{errorFor("focusKeywords")}</p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={store.slug}
                required
                className="border-none shadow-sm"
              />
              {errorFor("slug") && (
                <p className="text-sm text-red-500">{errorFor("slug")}</p>
              )}
            </div>

            {/* Is Popular */}
            <div className="space-y-2 flex items-center space-x-2">
              <input
                id="isPopular"
                name="isPopular"
                type="checkbox"
                defaultChecked={store.isPopular}
                className="h-4 w-4"
              />
              <Label htmlFor="isPopular" className="mb-0 cursor-pointer">
                Mark as Popular
              </Label>
            </div>
            {errorFor("isPopular") && (
              <p className="text-sm text-red-500">{errorFor("isPopular")}</p>
            )}

            {/* Is Active */}
            <div className="space-y-2 flex items-center space-x-2">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                defaultChecked={store.isActive}
                className="h-4 w-4"
              />
              <Label htmlFor="isActive" className="mb-0 cursor-pointer">
                Mark as Active
              </Label>
            </div>
            {errorFor("isActive") && (
              <p className="text-sm text-red-500">{errorFor("isActive")}</p>
            )}

            {/* General Error */}
            {"message" in (formState.error || {}) && (
              <p className="text-sm text-red-500">
                {(formState.error as { message?: string[] }).message?.[0]}
              </p>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex justify-end border-none">
          <Button
            type="submit"
            form="edit-store-form"
            disabled={isPending}
            className="flex items-center"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Updating..." : "Update Store"}
          </Button>
        </CardFooter>
      </Card>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>Store updated successfully!</p>
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
