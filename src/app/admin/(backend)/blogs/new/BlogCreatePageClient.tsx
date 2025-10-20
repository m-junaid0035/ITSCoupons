"use client";

import { useState, useEffect, startTransition, useRef } from "react";
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

export default function BlogCreatePageClient({
  categories,
  latestSEO,
}: {
  categories: string[];
  latestSEO: any;
}) {
  const router = useRouter();
  const [formState, dispatch, isPending] = useActionState(createBlogAction, initialState);

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // Type the ref as HTMLDivElement
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // event.target is EventTarget, cast to Node for contains()
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setCategoryDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const [writer, setWriter] = useState("");
  const [descriptionHtml, setDescriptionHtml] = useState("");

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // ✅ SEO state
  const [seo, setSeo] = useState({
    metaTitle: latestSEO?.metaTitle || "",
    metaDescription: latestSEO?.metaDescription || "",
    metaKeywords: (latestSEO?.metaKeywords || []).join(", "),
    focusKeywords: (latestSEO?.focusKeywords || []).join(", "),
    slug: latestSEO?.slug || "",
  });

  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as FieldErrors)[field]?.[0]
      : null;
  };

  // ✅ Auto SEO update when title changes
  const updateSEO = (blogTitle: string) => {
    if (!latestSEO) return;

    const replaceBlogTitle = (text: string) =>
      text.replace(/{{blogTitle}}|s_n/gi, blogTitle);

    const slugSource = latestSEO.slug || blogTitle;
    const processedSlug = replaceBlogTitle(slugSource)
      .toLowerCase()
      .replace(/\s+/g, "-");

    setSeo({
      metaTitle: replaceBlogTitle(latestSEO.metaTitle || ""),
      metaDescription: replaceBlogTitle(latestSEO.metaDescription || ""),
      metaKeywords: (latestSEO.metaKeywords || [])
        .map(replaceBlogTitle)
        .join(", "),
      focusKeywords: (latestSEO.focusKeywords || [])
        .map(replaceBlogTitle)
        .join(", "),
      slug: processedSlug,
    });
  };

  useEffect(() => {
    const titleInput = document.getElementById("title") as HTMLInputElement | null;
    if (!titleInput) return;

    const listener = () => {
      const blogTitle = titleInput.value.trim();
      if (blogTitle) updateSEO(blogTitle);
    };

    titleInput.addEventListener("input", listener);
    return () => titleInput.removeEventListener("input", listener);
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

    // ✅ attach SEO fields
    formData.set("metaTitle", seo.metaTitle);
    formData.set("metaDescription", seo.metaDescription);
    formData.set("metaKeywords", seo.metaKeywords);
    formData.set("focusKeywords", seo.focusKeywords);
    formData.set("slug", seo.slug);

    if (imageFile) {
      formData.set("imageFile", imageFile);
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
              <Input id="title" name="title" required placeholder="Enter blog title" />
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
                placeholder="Enter writer's name"
              />
              {errorFor("writer") && <p className="text-sm text-red-500">{errorFor("writer")}</p>}
            </div>

            {/* Category Search & Select */}
            <div className="space-y-2 relative" ref={categoryDropdownRef}>
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>

              <div className="relative">
                <Input
                  placeholder="Search category..."
                  value={categorySearch}
                  onFocus={() => setCategoryDropdownOpen(true)}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  required
                />

                {categoryDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border rounded shadow max-h-60 overflow-y-auto">
                    {categories
                      .filter((cat) =>
                        cat.toLowerCase().includes(categorySearch.toLowerCase())
                      )
                      .map((cat) => (
                        <div
                          key={cat}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => {
                            setSelectedCategory(cat);
                            setCategorySearch(cat);
                            setCategoryDropdownOpen(false);
                          }}
                        >
                          {cat}
                        </div>
                      ))}

                    {categories.filter((cat) =>
                      cat.toLowerCase().includes(categorySearch.toLowerCase())
                    ).length === 0 && (
                        <div className="px-4 py-2 text-gray-500">No categories found</div>
                      )}
                  </div>
                )}
              </div>

              <input type="hidden" name="category" value={selectedCategory || ""} required />

              {errorFor("category") && (
                <p className="text-sm text-red-500">{errorFor("category")}</p>
              )}
            </div>


            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug <span className="text-red-500">*</span></Label>
              <Input
                id="slug"
                name="slug"
                value={seo.slug}
                onChange={(e) => setSeo((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="example-blog-slug"
              />
              {errorFor("slug") && <p className="text-sm text-red-500">{errorFor("slug")}</p>}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label>Date <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
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
              <Label>Description <span className="text-red-500">*</span></Label>
              <RichTextEditor value={descriptionHtml} onChange={setDescriptionHtml} />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="imageFile">Blog Image <span className="text-red-500">*</span></Label>
              <Input id="imageFile" name="imageFile" type="file" accept="image/*" onChange={handleImageChange} />
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
              <Input id="metaTitle" name="metaTitle" value={seo.metaTitle} onChange={(e) => setSeo((prev) => ({ ...prev, metaTitle: e.target.value }))} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea id="metaDescription" name="metaDescription" value={seo.metaDescription} onChange={(e) => setSeo((prev) => ({ ...prev, metaDescription: e.target.value }))} rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaKeywords">Meta Keywords (comma separated)</Label>
              <Input id="metaKeywords" name="metaKeywords" value={seo.metaKeywords} onChange={(e) => setSeo((prev) => ({ ...prev, metaKeywords: e.target.value }))} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="focusKeywords">Focus Keywords (comma separated)</Label>
              <Input id="focusKeywords" name="focusKeywords" value={seo.focusKeywords} onChange={(e) => setSeo((prev) => ({ ...prev, focusKeywords: e.target.value }))} />
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

      {/* Success Dialog */}
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
