"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useRouter, useParams } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  fetchCategoryByIdAction,
  updateCategoryAction,
} from "@/actions/categoryActions";

interface FormState {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
}

const initialState: FormState = {
  error: {},
};

export default function EditCategoryForm() {
  const params = useParams();
  const categoryId = params.id as string;

  const router = useRouter();
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) =>
      await updateCategoryAction(prevState, categoryId, formData),
    initialState
  );

  useEffect(() => {
    async function fetchCategory() {
      const result = await fetchCategoryByIdAction(categoryId);
      if (result?.data) {
        setCategory(result.data);
      }
      setLoading(false);
    }
    fetchCategory();
  }, [categoryId]);

  if (loading) return <p>Loading...</p>;
  if (!category) return <p className="text-red-500">Category not found</p>;

  return (
    <form action={dispatch} className="space-y-6 max-w-xl">
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input id="name" name="name" defaultValue={category.name} required />
        {"name" in (formState.error || {}) && (
          <p className="text-sm text-red-500">
            {(formState.error as Record<string, string[]>).name?.[0]}
          </p>
        )}
      </div>

      {/* Slug Field */}
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" defaultValue={category.slug} required />
        {"slug" in (formState.error || {}) && (
          <p className="text-sm text-red-500">
            {(formState.error as Record<string, string[]>).slug?.[0]}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Update Category"}
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
