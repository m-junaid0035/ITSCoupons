"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCategoryAction } from "@/actions/categoryActions";

interface FormState {
  error?: Record<string, string[]>;
  data?: any;
}

const initialState: FormState = {
  error: {},
};

export default function CategoryForm() {
  const [formState, dispatch, isPending] = useActionState(
    createCategoryAction,
    initialState
  );

  return (
    <form action={dispatch} className="space-y-6 max-w-xl">
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input id="name" name="name" required />
        {formState.error?.name && (
          <p className="text-sm text-red-500">{formState.error.name[0]}</p>
        )}
      </div>

      {/* Slug Field */}
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" required />
        {formState.error?.slug && (
          <p className="text-sm text-red-500">{formState.error.slug[0]}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Category"}
      </Button>

      {/* General Error */}
      {formState.error?.message && (
        <p className="text-sm text-red-500">{formState.error.message[0]}</p>
      )}
    </form>
  );
}
