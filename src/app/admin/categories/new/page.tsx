"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { createCategoryAction } from "@/actions/categoryActions";

interface FormState {
  error?: Record<string, string[]> & { message?: string[] };
  data?: any;
}

const initialState: FormState = {
  error: {},
};

export default function CategoryForm() {
  const router = useRouter();

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      const result = await createCategoryAction(prevState, formData);
      if (!result.error || Object.keys(result.error).length === 0) {
        router.push("/categories"); // Redirect after success
      }
      return result;
    },
    initialState
  );

  return (
    <Card className="max-w-3xl mx-auto shadow-lg bg-white">
      <CardHeader className="flex items-center justify-between border-none">
        <CardTitle>Create Category</CardTitle>
        <Button variant="secondary" onClick={() => router.push("/categories")}>
          Back to Categories
        </Button>
      </CardHeader>

      <CardContent>
        <form action={dispatch} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input id="name" name="name" required className="border-none shadow-sm" />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" required className="border-none shadow-sm" />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              name="image"
              type="url"
              placeholder="https://example.com/image.jpg"
              required
              className="border-none shadow-sm"
            />
          </div>

          <CardFooter className="flex justify-end border-none">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Saving..." : "Save Category"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
