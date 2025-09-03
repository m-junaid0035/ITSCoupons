"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
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

import { createSEOAction } from "@/actions/seoActions";

interface FieldErrors {
  [key: string]: string[];
}

interface FormState {
  error?: FieldErrors | { message?: string[] };
  data?: any;
}

const initialState: FormState = {
  error: {},
};

export default function SEOForm() {
  const router = useRouter();
  const [formState, dispatch, isPending] = useActionState(
    createSEOAction,
    initialState
  );

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as FieldErrors)[field]?.[0]
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
      <Card className="w-full shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-none gap-2 sm:gap-0">
          <CardTitle className="text-lg sm:text-xl font-semibold">Create SEO Entry</CardTitle>
          <Button variant="secondary" onClick={() => router.push("/admin/seo")}>Back to SEO List</Button>
        </CardHeader>

        <CardContent>
          <form action={dispatch} className="space-y-6">
            {/* Meta Title */}
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title <span className="text-red-500">*</span></Label>
              <Input
                id="metaTitle"
                name="metaTitle"
                required
                placeholder="Enter meta title (add s_n where you want to add the store name)"
              />
              {errorFor("metaTitle") && (
                <p className="text-sm text-red-500">{errorFor("metaTitle")}</p>
              )}
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description <span className="text-red-500">*</span></Label>
              <Textarea
                id="metaDescription"
                name="metaDescription"
                rows={3}
                placeholder="Enter meta description (add s_n where you want to add the store name)"
              />
              {errorFor("metaDescription") && (
                <p className="text-sm text-red-500">{errorFor("metaDescription")}</p>
              )}
            </div>

            {/* Meta Keywords */}
            <div className="space-y-2">
              <Label htmlFor="metaKeywords">Meta Keywords (comma-separated)</Label>
              <Input
                id="metaKeywords"
                name="metaKeywords"
                placeholder="keyword1, keyword2 (add s_n where you want to add the store name)"
              />
              {errorFor("metaKeywords") && (
                <p className="text-sm text-red-500">{errorFor("metaKeywords")}</p>
              )}
            </div>

            {/* Focus Keywords */}
            <div className="space-y-2">
              <Label htmlFor="focusKeywords">Focus Keywords (comma-separated)</Label>
              <Input
                id="focusKeywords"
                name="focusKeywords"
                placeholder="focus1, focus2 (add s_n where you want to add the store name)"
              />
              {errorFor("focusKeywords") && (
                <p className="text-sm text-red-500">{errorFor("focusKeywords")}</p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug <span className="text-red-500">*</span></Label>
              <Input
                id="slug"
                name="slug"
                required
                placeholder="seo-entry-slug (add s_n where you want to add the store name)"
              />
              {errorFor("slug") && (
                <p className="text-sm text-red-500">{errorFor("slug")}</p>
              )}
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
                {isPending ? "Saving..." : "Save SEO"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>SEO entry saved successfully!</p>
          <DialogFooter>
            <Button
              onClick={() => {
                setSuccessDialogOpen(false);
                router.push("/admin/seo");
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
