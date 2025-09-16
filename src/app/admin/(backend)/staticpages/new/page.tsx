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
import { createStaticPageAction } from "@/actions/staticPagesActions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import RichTextEditor from "@/components/RichTextEditor";

interface FormState {
  error?: Record<string, string[]> & { message?: string[] };
  data?: any;
}

const initialState: FormState = {
  error: {},
};

export default function StaticPageForm() {
  const router = useRouter();

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      const result = await createStaticPageAction(prevState, formData);
      return result;
    },
    initialState
  );

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [contentHtml, setContentHtml] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  // Auto-update slug when title changes
  useEffect(() => {
    if (title) {
      setSlug(title.trim().toLowerCase().replace(/\s+/g, "-"));
    } else {
      setSlug("");
    }
  }, [title]);

  useEffect(() => {
    if (formState.data && !formState.error) {
      setSuccessDialogOpen(true);
    }

    if (formState.error && "message" in formState.error) {
      alert(
        formState.error.message?.[0] ||
          "An error occurred while saving the page"
      );
    }
  }, [formState]);

  return (
    <>
      <Card className="w-full shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-none gap-2 sm:gap-0">
          <CardTitle className="text-lg sm:text-xl font-semibold">
            Create Static Page
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
              // attach content HTML before submitting
              formData.set("content", contentHtml);
              return dispatch(formData);
            }}
            className="space-y-6"
          >
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Page Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="Enter page title"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug (auto filled)
              </Label>
              <Input
                id="slug"
                name="slug"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="about-us"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label>
                Content <span className="text-red-500">*</span>
              </Label>
              <RichTextEditor value={contentHtml} onChange={setContentHtml} />
            </div>

            {/* Published toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                value="true"
                defaultChecked
                className="w-4 h-4"
              />
              <Label htmlFor="isPublished">Published</Label>
            </div>

            <CardFooter className="flex justify-end border-none">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Saving..." : "Save Page"}
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
          <p>Static page created successfully!</p>
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
