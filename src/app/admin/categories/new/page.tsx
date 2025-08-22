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
import DescriptionEditor from "@/components/DescriptionEditor";

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
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [descriptionHtml, setDescriptionHtml] = useState("");

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
              // attach description HTML before submitting
              formData.set("description", descriptionHtml);
              return dispatch(formData);
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

            {/* Description Modal */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Button type="button" onClick={() => setDescriptionModalOpen(true)}>
                Edit Description
              </Button>
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

      {/* Description Modal */}
      <Dialog open={descriptionModalOpen} onOpenChange={setDescriptionModalOpen}>
        <DialogContent className="max-w-3xl w-full">
          <DialogHeader>
            <DialogTitle>Edit Description</DialogTitle>
          </DialogHeader>
          <DescriptionEditor
            initialContent={descriptionHtml}
            onChange={setDescriptionHtml}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDescriptionModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setDescriptionModalOpen(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
