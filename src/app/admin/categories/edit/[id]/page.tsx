"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActionState } from "react";
import LoadingSkeleton from "./loading"; // Your skeleton loader component
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
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

import {
  fetchCategoryByIdAction,
  updateCategoryAction,
} from "@/actions/categoryActions";
import RichTextEditor from "@/components/RichTextEditor";

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
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const [descriptionHtml, setDescriptionHtml] = useState("");

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) =>
      await updateCategoryAction(prevState, categoryId, formData),
    initialState
  );

  // --- New States for name & slug auto-sync ---
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugEdited, setIsSlugEdited] = useState(false);

  useEffect(() => {
    async function loadCategory() {
      const res = await fetchCategoryByIdAction(categoryId);
      if (res?.data) {
        setCategory(res.data);
        setDescriptionHtml(res.data.description ?? "");
        setName(res.data.name ?? "");
        setSlug(res.data.slug ?? "");
      }
      setLoading(false);
    }
    loadCategory();
  }, [categoryId]);

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

  // Auto-update slug when name changes (unless manually edited)
  useEffect(() => {
    if (!isSlugEdited) {
      const generatedSlug = name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_");
      setSlug(generatedSlug);
    }
  }, [name, isSlugEdited]);

  if (loading) return <LoadingSkeleton />;
  if (!category)
    return (
      <p className="text-red-500 text-center mt-4">Category not found</p>
    );

  const errorFor = (field: string) =>
    formState.error &&
    typeof formState.error === "object" &&
    field in formState.error
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;

  return (
    <>
      <Card className="w-full shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-none gap-2 sm:gap-0">
          <CardTitle className="text-lg sm:text-xl font-semibold">Edit Category</CardTitle>
          <Button variant="secondary" onClick={() => router.push("/admin/categories")}>Back to Categories</Button>
        </CardHeader>

        <CardContent>
          <form
            action={(formData: FormData) => {
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="Enter category name"
              />
              {errorFor("name") && (
                <p className="text-sm text-red-500">{errorFor("name")}</p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsSlugEdited(true); // user manually edited slug
                }}
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="category-slug"
              />
              {errorFor("slug") && (
                <p className="text-sm text-red-500">{errorFor("slug")}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <RichTextEditor value={descriptionHtml} onChange={setDescriptionHtml} />
            </div>

            {/* Is Popular */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPopular"
                name="isPopular"
                value="true"
                defaultChecked={!!category.isPopular}
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
                defaultChecked={!!category.isTrending}
                className="w-4 h-4"
              />
              <Label htmlFor="isTrending">Trending</Label>
            </div>

            {/* General Error */}
            {"message" in (formState.error ?? {}) && (
              <p className="text-sm text-red-500">
                {(formState.error as any).message?.[0]}
              </p>
            )}

            <CardFooter className="flex justify-end border-none">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Saving..." : "Update Category"}
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
          <p>Category updated successfully!</p>
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
