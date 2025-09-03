"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActionState } from "react";
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

import RichTextEditor from "@/components/RichTextEditor";
import LoadingSkeleton from "./loading"; // loader like in category edit

import {
  fetchStaticPageByIdAction,
  updateStaticPageAction,
} from "@/actions/staticPagesActions";

interface FormState {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
}

const initialState: FormState = {
  error: {},
};

export default function EditStaticPageForm() {
  const params = useParams();
  const pageId = params.id as string;
  const router = useRouter();

  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [contentHtml, setContentHtml] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) =>
      await updateStaticPageAction(prevState, pageId, formData),
    initialState
  );

  useEffect(() => {
    async function loadPage() {
      const res = await fetchStaticPageByIdAction(pageId);
      if (res?.data) {
        setPage(res.data);
        setContentHtml(res.data.content ?? "");
        setTitle(res.data.title ?? "");
        setSlug(res.data.slug ?? "");
      }
      setLoading(false);
    }
    loadPage();
  }, [pageId]);

  // Auto-update slug when title changes
  useEffect(() => {
    if (title) {
      setSlug(title.trim().toLowerCase().replace(/\s+/g, "_"));
    } else {
      setSlug("");
    }
  }, [title]);

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
  if (!page)
    return (
      <p className="text-red-500 text-center mt-4">Page not found</p>
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
          <CardTitle className="text-lg sm:text-xl font-semibold">
            Edit Static Page
          </CardTitle>
          <Button
            variant="secondary"
            onClick={() => router.push("/admin/staticpages")}
          >
            Back to Pages
          </Button>
        </CardHeader>

        <CardContent>
          <form
            action={(formData: FormData) => {
              formData.set("content", contentHtml);
              return dispatch(formData);
            }}
            className="space-y-6"
          >
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="Enter page title"
              />
              {errorFor("title") && (
                <p className="text-sm text-red-500">{errorFor("title")}</p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="page-slug"
              />
              {errorFor("slug") && (
                <p className="text-sm text-red-500">{errorFor("slug")}</p>
              )}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label>Content</Label>
              <RichTextEditor value={contentHtml} onChange={setContentHtml} />
            </div>

            {/* Published toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                value="true"
                defaultChecked={!!page.isPublished}
                className="w-4 h-4"
              />
              <Label htmlFor="isPublished">Published</Label>
            </div>

            {/* General Error */}
            {"message" in (formState.error ?? {}) && (
              <p className="text-sm text-red-500">
                {(formState.error as any).message?.[0]}
              </p>
            )}

            <CardFooter className="flex justify-end border-none">
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isPending ? "Saving..." : "Update Page"}
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
          <p>Page updated successfully!</p>
          <DialogFooter>
            <Button
              onClick={() => {
                setSuccessDialogOpen(false);
                router.push("/admin/staticpages");
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
