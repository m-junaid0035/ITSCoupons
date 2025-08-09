"use client";

import { useActionState, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { createStoreAction } from "@/actions/storeActions";
import { fetchAllCategoriesAction } from "@/actions/categoryActions";

interface FormState {
  error?: Record<string, string[]>;
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
  const [formState, dispatch, isPending] = useActionState(
    createStoreAction,
    initialState
  );

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      const result = await fetchAllCategoriesAction();
      if (result.data && Array.isArray(result.data)) {
        setCategories(result.data);
      }
    }
    loadCategories();
  }, []);

  return (
    <form action={dispatch} className="space-y-6 max-w-2xl">
      {/* Store Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Store Name</Label>
        <Input id="name" name="name" required />
        {formState.error?.name && (
          <p className="text-sm text-red-500">{formState.error.name[0]}</p>
        )}
      </div>

      {/* Store Network URL */}
      <div className="space-y-2">
        <Label htmlFor="storeNetworkUrl">Store Network URL</Label>
        <Input id="storeNetworkUrl" name="storeNetworkUrl" type="url" required />
        {formState.error?.storeNetworkUrl && (
          <p className="text-sm text-red-500">{formState.error.storeNetworkUrl[0]}</p>
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
        {formState.error?.categories && (
          <p className="text-sm text-red-500">{formState.error.categories[0]}</p>
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
        />
        {formState.error?.totalCouponUsedTimes && (
          <p className="text-sm text-red-500">{formState.error.totalCouponUsedTimes[0]}</p>
        )}
      </div>

      {/* Image URL */}
      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input id="image" name="image" type="url" required />
        {formState.error?.image && (
          <p className="text-sm text-red-500">{formState.error.image[0]}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={4} required />
        {formState.error?.description && (
          <p className="text-sm text-red-500">{formState.error.description[0]}</p>
        )}
      </div>

      {/* Meta Title */}
      <div className="space-y-2">
        <Label htmlFor="metaTitle">Meta Title</Label>
        <Input id="metaTitle" name="metaTitle" required />
        {formState.error?.metaTitle && (
          <p className="text-sm text-red-500">{formState.error.metaTitle[0]}</p>
        )}
      </div>

      {/* Meta Description */}
      <div className="space-y-2">
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Textarea id="metaDescription" name="metaDescription" rows={3} required />
        {formState.error?.metaDescription && (
          <p className="text-sm text-red-500">{formState.error.metaDescription[0]}</p>
        )}
      </div>

      {/* Meta Keywords */}
      <div className="space-y-2">
        <Label htmlFor="metaKeywords">Meta Keywords (comma separated)</Label>
        <Input id="metaKeywords" name="metaKeywords" />
        {formState.error?.metaKeywords && (
          <p className="text-sm text-red-500">{formState.error.metaKeywords[0]}</p>
        )}
      </div>

      {/* Focus Keywords */}
      <div className="space-y-2">
        <Label htmlFor="focusKeywords">Focus Keywords (comma separated)</Label>
        <Input id="focusKeywords" name="focusKeywords" />
        {formState.error?.focusKeywords && (
          <p className="text-sm text-red-500">{formState.error.focusKeywords[0]}</p>
        )}
      </div>

      {/* ✅ isPopular */}
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

      {/* ✅ isActive */}
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
        <Input id="slug" name="slug" required />
        {formState.error?.slug && (
          <p className="text-sm text-red-500">{formState.error.slug[0]}</p>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Store"}
      </Button>

      {/* General Error */}
      {formState.error?.message && (
        <p className="text-sm text-red-500">{formState.error.message[0]}</p>
      )}
    </form>
  );
}
