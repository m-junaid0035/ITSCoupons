"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useParams, useRouter } from "next/navigation";

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
import LoadingSkeleton from "./loading";
import { toast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  fetchSEOByIdAction,
  updateSEOAction,
} from "@/actions/seoActions";

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

export default function EditSEOForm() {
  const { id } = useParams();
  const router = useRouter();
  const seoId = id as string;

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      return await updateSEOAction(prevState, seoId, formData);
    },
    initialState
  );

  const [seo, setSEO] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as FieldErrors)[field]?.[0]
      : null;
  };

  useEffect(() => {
    async function loadSEO() {
      const res = await fetchSEOByIdAction(seoId);
      if (res.data) {
        setSEO(res.data);
      }
      setLoading(false);
    }
    loadSEO();
  }, [seoId]);

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

  if (loading) return <LoadingSkeleton />;
  if (!seo) return <p className="text-red-500">SEO entry not found.</p>;

  return (
    <>
      <Card className="w-full shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-none gap-2 sm:gap-0">
          <CardTitle className="text-lg sm:text-xl font-semibold">Edit SEO Entry</CardTitle>
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
                defaultValue={seo.metaTitle}
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
                defaultValue={seo.metaDescription}
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
                defaultValue={Array.isArray(seo.metaKeywords) ? seo.metaKeywords.join(", ") : ""}
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
                defaultValue={Array.isArray(seo.focusKeywords) ? seo.focusKeywords.join(", ") : ""}
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
                defaultValue={seo.slug}
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
                {isPending ? "Saving..." : "Update SEO"}
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
          <p>SEO entry updated successfully!</p>
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
