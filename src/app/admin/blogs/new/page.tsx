"use client";

import { useState, useEffect, startTransition } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

import { createBlogAction } from "@/actions/blogActions";
import { fetchCategoryNamesAction } from "@/actions/categoryActions";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/RichTextEditor";

interface FieldErrors {
  [key: string]: string[];
}

interface FormState {
  error?: FieldErrors | { message?: string[] };
  data?: any;
}

const initialState: FormState = { error: {} };

export default function BlogCreatePage() {
  const router = useRouter();
  const [formState, dispatch, isPending] = useActionState(createBlogAction, initialState);

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [writer, setWriter] = useState("");
  const [descriptionHtml, setDescriptionHtml] = useState("");

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as FieldErrors)[field]?.[0]
      : null;
  };

  // Fetch category names
  useEffect(() => {
    fetchCategoryNamesAction().then((res) => {
      if (res.data) setCategories(res.data);
      if (res.error) {
        toast({
          title: "Error",
          description: res.error.message?.[0],
          variant: "destructive",
        });
      }
    });
  }, []);

  // Handle success or error messages
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

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (date) formData.set("date", date.toISOString());
    formData.set("category", selectedCategory);
    formData.set("writer", writer);
    formData.set("description", descriptionHtml);

    if (imageFile) {
      formData.set("imageFile", imageFile); // attach the file
    }

    startTransition(() => dispatch(formData));
  };

  return (
    <>
      <Card className="w-full shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-none gap-2 sm:gap-0">
          <CardTitle className="text-lg sm:text-xl font-semibold">Create Blog</CardTitle>
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
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="Enter blog title"
              />
              {errorFor("title") && <p className="text-sm text-red-500">{errorFor("title")}</p>}
            </div>

            {/* Writer / Author */}
            <div className="space-y-2">
              <Label htmlFor="writer">Writer <span className="text-red-500">*</span></Label>
              <Input
                id="writer"
                name="writer"
                value={writer}
                onChange={(e) => setWriter(e.target.value)}
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="Enter writer's name"
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
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="example-blog-slug"
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
                    className={cn(
                      "w-full justify-start text-left font-normal border-none shadow-sm bg-gray-50 dark:bg-gray-700",
                      !date && "text-muted-foreground"
                    )}
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

            {/* Description */}
            <div className="space-y-2">
              <Label>
                Description <span className="text-red-500">*</span>
              </Label>
              <RichTextEditor value={descriptionHtml} onChange={setDescriptionHtml} />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="imageFile">Blog Image <span className="text-red-500">*</span></Label>
              <Input
                id="imageFile"
                name="imageFile"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {preview && (
                <div className="mt-2">
                  <img src={preview} alt="Preview" className="w-48 h-32 object-cover rounded-md border" />
                  <Button type="button" variant="outline" size="sm" onClick={removeImage} className="mt-2">
                    Remove Image
                  </Button>
                </div>
              )}
              {errorFor("imageFile") && <p className="text-sm text-red-500">{errorFor("imageFile")}</p>}
            </div>

            {/* SEO Fields */}
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input id="metaTitle" name="metaTitle" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" placeholder="SEO meta title" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea id="metaDescription" name="metaDescription" rows={3} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" placeholder="SEO meta description" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaKeywords">Meta Keywords (comma separated)</Label>
              <Input id="metaKeywords" name="metaKeywords" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" placeholder="keyword1, keyword2, keyword3" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="focusKeywords">Focus Keywords (comma separated)</Label>
              <Input id="focusKeywords" name="focusKeywords" className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" placeholder="keyword1, keyword2" />
            </div>

            {/* General Error */}
            {"message" in (formState.error ?? {}) && (
              <p className="text-sm text-red-500">{(formState.error as any).message?.[0]}</p>
            )}

            <CardFooter className="flex justify-end border-none">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Saving..." : "Save Blog"}
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
          <p>Blog created successfully!</p>
          <DialogFooter>
            <Button onClick={() => { setSuccessDialogOpen(false); router.push("/admin/blogs"); }}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
