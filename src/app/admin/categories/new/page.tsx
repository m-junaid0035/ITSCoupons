"use client";

import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
      return result;
    },
    initialState
  );

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  useEffect(() => {
    if (formState.data && !formState.error) {
      setSuccessDialogOpen(true);
    }

    if (formState.error && "message" in formState.error) {
      alert(
        formState.error.message?.[0] || "An error occurred while saving category"
      );
    }
  }, [formState]);

  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex items-center justify-between border-none">
          <CardTitle>Create Category</CardTitle>
          <Button
            variant="secondary"
            onClick={() => router.push("/admin/categories")}
          >
            Back to Categories
          </Button>
        </CardHeader>

        <CardContent>
          <form
            action={(formData: FormData) => {
              return dispatch(formData); // FormData now automatically includes isPopular and isTrending if checked
            }}
            className="space-y-6"
          >
            {/* Category Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                name="name"
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="Enter category name"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="category-slug"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full rounded-md border-none shadow-sm bg-gray-50 dark:bg-gray-700 p-2"
                placeholder="Enter category description"
              />
            </div>

            {/* Is Popular */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPopular"
                name="isPopular"
                value="true"
                className="w-4 h-4"
              />
              <Label htmlFor="isPopular">Popular</Label>
            </div>

            {/* Is Trending */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isTrending"
                name="isTrending"
                value="true"
                className="w-4 h-4"
              />
              <Label htmlFor="isTrending">Trending</Label>
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

      {/* Success Confirmation Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>Category created successfully!</p>
          <DialogFooter>
            <Button
              onClick={() => {
                setSuccessDialogOpen(false);
                router.push("/admin/categories");
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
