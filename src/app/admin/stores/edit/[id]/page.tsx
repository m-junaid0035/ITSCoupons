"use client";

import { useActionState, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
  const storeId = params.id as string;

  const [store, setStore] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Loading...</p>;
  if (!store) return <p className="text-red-500">Store not found</p>;

  return (
    <form action={dispatch} className="space-y-6 max-w-2xl">
      {/* Store Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Store Name</Label>
        <Input id="name" name="name" defaultValue={store.name} required />
        {"name" in (formState.error || {}) && (
          <p className="text-sm text-red-500">
            {(formState.error as Record<string, string[]>).name?.[0]}
          </p>
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
        />
        {"storeNetworkUrl" in (formState.error || {}) && (
          <p className="text-sm text-red-500">
            {(formState.error as Record<string, string[]>).storeNetworkUrl?.[0]}
          </p>
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
                defaultChecked={store.categories?.includes(cat._id)}
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
        {"categories" in (formState.error || {}) && (
          <p className="text-sm text-red-500">
            {(formState.error as Record<string, string[]>).categories?.[0]}
          </p>
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
        />
        {"totalCouponUsedTimes" in (formState.error || {}) && (
          <p className="text-sm text-red-500">
            {(formState.error as Record<string, string[]>).totalCouponUsedTimes?.[0]}
          </p>
        )}
      </div>

      {/* Image URL */}
      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input id="image" name="image" type="url" defaultValue={store.image} required />
        {"image" in (formState.error || {}) && (
          <p className="text-sm text-red-500">
            {(formState.error as Record<string, string[]>).image?.[0]}
          </p>
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
        />
        {"description" in (formState.error || {}) && (
          <p className="text-sm text-red-500">
            {(formState.error as Record<string, string[]>).description?.[0]}
          </p>
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
        />
        {"metaTitle" in (formState.error || {}) && (
          <p className="text-sm text-red-500">
            {(formState.error as Record<string, string[]>).metaTitle?.[0]}
          </p>
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
        />
        {"metaDescription" in (formState.error || {}) && (
          <p className="text-sm text-red-500">
            {(formState.error as Record<string, string[]>).metaDescription?.[0]}
          </p>
        )}
      </div>

      {/* Meta Keywords */}
      <div className="space-y-2">
        <Label htmlFor="metaKeywords">Meta Keywords (comma separated)</Label>
        <Input
          id="metaKeywords"
          name="metaKeywords"
          defaultValue={store.metaKeywords}
        />
        {"metaKeywords" in (formState.error || {}) && (
          <p className="text-sm text-red-500">
            {(formState.error as Record<string, string[]>).metaKeywords?.[0]}
          </p>
        )}
      </div>

      {/* Focus Keywords */}
      <div className="space-y-2">
        <Label htmlFor="focusKeywords">Focus Keywords (comma separated)</Label>
        <Input
          id="focusKeywords"
          name="focusKeywords"
          defaultValue={store.focusKeywords}
        />
        {"focusKeywords" in (formState.error || {}) && (
          <p className="text-sm text-red-500">
            {(formState.error as Record<string, string[]>).focusKeywords?.[0]}
          </p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" defaultValue={store.slug} required />
        {"slug" in (formState.error || {}) && (
          <p className="text-sm text-red-500">
            {(formState.error as Record<string, string[]>).slug?.[0]}
          </p>
        )}
      </div>
      {/* Is Popular */}
      <div className="space-y-2">
        <Label htmlFor="isPopular">Is Popular</Label>
        <input
          id="isPopular"
          name="isPopular"
          type="checkbox"
          defaultChecked={store.isPopular}
          className="h-4 w-4"
        />
        {"isPopular" in (formState.error || {}) && (
          <p className="text-sm text-red-500">
            {(formState.error as Record<string, string[]>).isPopular?.[0]}
          </p>
        )}
      </div>

      {/* Is Active */}
      <div className="space-y-2">
        <Label htmlFor="isActive">Is Active</Label>
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          defaultChecked={store.isActive}
          className="h-4 w-4"
        />
        {"isActive" in (formState.error || {}) && (
          <p className="text-sm text-red-500">
            {(formState.error as Record<string, string[]>).isActive?.[0]}
          </p>
        )}
      </div>


      {/* Submit */}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update Store"}
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
