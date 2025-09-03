"use client";

import { useEffect, useState, startTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActionState } from "react";
import LoadingSkeleton from "./loading";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { fetchBlogByIdAction, updateBlogAction } from "@/actions/blogActions";
import { fetchCategoryNamesAction } from "@/actions/categoryActions";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import DescriptionEditor from "@/components/DescriptionEditor";
import { Textarea } from "@/components/ui/textarea";

interface FieldErrors {
  [key: string]: string[];
}

interface FormState {
  error?: FieldErrors | { message?: string[] };
  data?: any;
}

const initialState: FormState = { error: {} };

export default function EditBlogForm() {
  const params = useParams();
  const blogId = params.id as string;
  const router = useRouter();

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) =>
      await updateBlogAction(prevState, blogId, formData),
    initialState
  );

  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [writer, setWriter] = useState("");
  const [descriptionHtml, setDescriptionHtml] = useState("");
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);

  // Load blog data
  useEffect(() => {
    async function loadData() {
      const res = await fetchBlogByIdAction(blogId);
      if (res?.data) {
        setBlog(res.data);
        setWriter(res.data.writer || "");
        setSelectedCategory(res.data.category || "");
        setDescriptionHtml(res.data.description || "");
        if (res.data.date) setDate(new Date(res.data.date));
      }
      setLoading(false);
    }
    loadData();
  }, [blogId]);

  // Fetch categories
  useEffect(() => {
    fetchCategoryNamesAction().then((res) => {
      if (res.data) setCategories(res.data);
    });
  }, []);

  // Handle success/error
  useEffect(() => {
    if (formState.data && !formState.error) {
      setSuccessDialogOpen(true);
    }

    if (formState.error && "message" in formState.error) {
      toast({
        title: "Error",
        description: (formState.error as any).message?.[0] || "Something went wrong",
        variant: "destructive",
      });
    }
  }, [formState]);

  if (loading) return <LoadingSkeleton />;
  if (!blog) return <p className="text-red-500">Blog not found</p>;

  const errorFor = (field: string) =>
    formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (date) formData.set("date", date.toISOString());
    formData.set("category", selectedCategory);
    formData.set("writer", writer);
    formData.set("description", descriptionHtml);
    startTransition(() => dispatch(formData));
  };

  return (
    <>
      <Card className="w-full shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-none gap-2 sm:gap-0">
          <CardTitle className="text-lg sm:text-xl font-semibold">Edit Blog</CardTitle>
          <Button variant="secondary" onClick={() => router.push("/admin/blogs")}>Back to Blogs</Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                name="title"
                defaultValue={blog.title}
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("title") && <p className="text-sm text-red-500">{errorFor("title")}</p>}
            </div>

            {/* Writer */}
            <div className="space-y-2">
              <Label htmlFor="writer">Writer <span className="text-red-500">*</span></Label>
              <Input
                id="writer"
                name="writer"
                value={writer}
                onChange={(e) => setWriter(e.target.value)}
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("writer") && <p className="text-sm text-red-500">{errorFor("writer")}</p>}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
              <select
                id="category"
                name="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700 w-full p-2 rounded"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errorFor("category") && <p className="text-sm text-red-500">{errorFor("category")}</p>}
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug <span className="text-red-500">*</span></Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={blog.slug}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("slug") && <p className="text-sm text-red-500">{errorFor("slug")}</p>}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label>Date <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
              {errorFor("date") && <p className="text-sm text-red-500">{errorFor("date")}</p>}
            </div>

            {/* Description with modal */}
            <div className="space-y-2">
              <Label>Description <span className="text-red-500">*</span></Label>
              <Button type="button" onClick={() => setDescriptionModalOpen(true)}>
                {descriptionHtml ? "Edit Description" : "Add Description"}
              </Button>
              {errorFor("description") && <p className="text-sm text-red-500">{errorFor("description")}</p>}
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="imageFile">Blog Image <span className="text-red-500">*</span></Label>
              {blog.image && (
                <img
                  src={blog.image}
                  alt="Current Blog"
                  className="w-40 h-28 object-cover rounded mb-2"
                />
              )}
              <Input
                id="imageFile"
                name="imageFile"
                type="file"
                accept="image/*"
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("imageFile") && <p className="text-sm text-red-500">{errorFor("imageFile")}</p>}
            </div>

            {/* SEO Fields */}
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input id="metaTitle" name="metaTitle" defaultValue={blog.metaTitle} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea id="metaDescription" name="metaDescription" rows={3} defaultValue={blog.metaDescription} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaKeywords">Meta Keywords (comma separated)</Label>
              <Input id="metaKeywords" name="metaKeywords" defaultValue={blog.metaKeywords?.join(", ") || ""} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="focusKeywords">Focus Keywords (comma separated)</Label>
              <Input id="focusKeywords" name="focusKeywords" defaultValue={blog.focusKeywords?.join(", ") || ""} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
            </div>

            {/* General Error */}
            {"message" in (formState.error ?? {}) && (
              <p className="text-sm text-red-500">{(formState.error as any).message?.[0]}</p>
            )}

            <CardFooter className="flex justify-end border-none px-0 pt-0">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Updating..." : "Update Blog"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {/* Description Editor Modal */}
      <Dialog open={descriptionModalOpen} onOpenChange={setDescriptionModalOpen}>
        <DialogContent className="max-w-3xl w-full">
          <DialogHeader>
            <DialogTitle>Edit Description</DialogTitle>
          </DialogHeader>
          <DescriptionEditor initialContent={descriptionHtml} onChange={setDescriptionHtml} />
          <DialogFooter className="space-x-2">
            <Button variant="outline" onClick={() => setDescriptionModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setDescriptionModalOpen(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>Blog updated successfully!</p>
          <DialogFooter>
            <Button onClick={() => { setSuccessDialogOpen(false); router.push("/admin/blogs"); }}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
