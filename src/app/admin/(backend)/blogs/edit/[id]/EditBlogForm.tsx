"use client";

import { useEffect, useState, startTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import LoadingSkeleton from "./loading";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2, X } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { updateBlogAction } from "@/actions/blogActions";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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

export default function EditBlogForm({
  blogId,
  blog,
  categories,
  seoTemplate,
}: {
  blogId: string;
  blog: any;
  categories: string[];
  seoTemplate: any;
}) {
  const router = useRouter();

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) =>
      await updateBlogAction(prevState, blogId, formData),
    initialState
  );

  const [loading, setLoading] = useState(!blog);
  const [date, setDate] = useState<Date | undefined>(
    blog?.date ? new Date(blog.date) : undefined
  );
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState(blog?.category || "");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
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

  const [writer, setWriter] = useState(blog?.writer || "");
  const [descriptionHtml, setDescriptionHtml] = useState(blog?.description || "");
  const [title, setTitle] = useState(blog?.title || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(blog?.image || null);
  const [selectedCategory, setSelectedCategory] = useState(blog?.category || "");

  // ✅ SEO state
  const [seo, setSeo] = useState({
    metaTitle: blog?.metaTitle || "",
    metaDescription: blog?.metaDescription || "",
    metaKeywords: blog?.metaKeywords?.join(", ") || "",
    focusKeywords: blog?.focusKeywords?.join(", ") || "",
    slug: blog?.slug || "",
  });

  /** ---------------- Image Handling ---------------- */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else setImagePreview(null);
  };
  const removeImage = () => { setImageFile(null); setImagePreview(null); };


  // ✅ Auto SEO update when title changes
  const updateSEO = (blogTitle: string) => {
    if (!seoTemplate) return;

    const replaceBlogTitle = (text: string) =>
      text.replace(/{{blogTitle}}|s_n/gi, blogTitle);

    const slugSource = seoTemplate.slug || blogTitle;
    const processedSlug = replaceBlogTitle(slugSource)
      .toLowerCase()
      .replace(/\s+/g, "-");

    setSeo({
      metaTitle: replaceBlogTitle(seoTemplate.metaTitle || ""),
      metaDescription: replaceBlogTitle(seoTemplate.metaDescription || ""),
      metaKeywords: (seoTemplate.metaKeywords || [])
        .map(replaceBlogTitle)
        .join(", "),
      focusKeywords: (seoTemplate.focusKeywords || [])
        .map(replaceBlogTitle)
        .join(", "),
      slug: processedSlug,
    });
  };

  // Run updateSEO when title changes
  useEffect(() => {
    if (title.trim()) {
      updateSEO(title);
    }
  }, [title]);

  // Handle success/error
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
  if (!blog) return <p className="text-red-500">Blog not found</p>;

  const errorFor = (field: string) =>
    formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (date) formData.set("date", date.toISOString());
    async function urlToFile(url: string, filename: string, mimeType: string) {
      const res = await fetch(url);
      const blob = await res.blob();
      return new File([blob], filename, { type: mimeType });
    }
    if (imageFile) {
      // ✅ User selected a new image
      formData.set("imageFile", imageFile);
    } else if (imagePreview && imagePreview === blog.image) {
      // ✅ User didn’t change image → keep the same existing one
      formData.set("existingImage", blog.image);
    } else {
      // 🚫 No image at all → show error
      toast({
        title: "Validation Error",
        description: "Store image is required",
        variant: "destructive",
      });
      return;
    }

    formData.set("category", selectedCategory);
    formData.set("writer", writer);
    formData.set("description", descriptionHtml);
    formData.set("title", title);

    // ✅ attach SEO fields
    formData.set("metaTitle", seo.metaTitle);
    formData.set("metaDescription", seo.metaDescription);
    formData.set("metaKeywords", seo.metaKeywords);
    formData.set("focusKeywords", seo.focusKeywords);
    formData.set("slug", seo.slug);

    startTransition(() => dispatch(formData));
  };

  return (
    <>
      <Card className="w-full shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-none gap-2 sm:gap-0">
          <CardTitle className="text-lg sm:text-xl font-semibold">
            Edit Blog
          </CardTitle>
          <Button
            variant="secondary"
            onClick={() => router.push("/admin/blogs")}
          >
            Back to Blogs
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("title") && (
                <p className="text-sm text-red-500">{errorFor("title")}</p>
              )}
            </div>

            {/* Writer */}
            <div className="space-y-2">
              <Label htmlFor="writer">
                Writer <span className="text-red-500">*</span>
              </Label>
              <Input
                id="writer"
                name="writer"
                value={writer}
                onChange={(e) => setWriter(e.target.value)}
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("writer") && (
                <p className="text-sm text-red-500">{errorFor("writer")}</p>
              )}
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
                  className="w-full p-2 rounded"
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

              {/* Hidden input for form submission */}
              <input
                type="hidden"
                name="category"
                value={selectedCategory || ""}
                required
              />

              {errorFor("category") && (
                <p className="text-sm text-red-500">{errorFor("category")}</p>
              )}
            </div>


            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug <span className="text-red-500">*</span>
              </Label>
              <Input
                id="slug"
                name="slug"
                value={seo.slug}
                onChange={(e) =>
                  setSeo((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("slug") && (
                <p className="text-sm text-red-500">{errorFor("slug")}</p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label>
                Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errorFor("date") && (
                <p className="text-sm text-red-500">{errorFor("date")}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>
                Description <span className="text-red-500">*</span>
              </Label>
              <RichTextEditor
                value={descriptionHtml}
                onChange={setDescriptionHtml}
              />
            </div>

            {/* Hidden field for existing image */}
            {!imageFile && blog?.image && (
              <input type="hidden" name="existingImage" value={blog.image} />
            )}


            {/* Image */}
            <div className="space-y-2">
              <Label htmlFor="imageFile">
                Store Image <span className="text-red-500">*</span>
              </Label>
              <Input id="imageFile" name="imageFile" type="file" accept="image/*" onChange={handleImageChange} className="border-none shadow-sm bg-gray-50 dark:bg-gray-700" />
              {imagePreview && (
                <div className="relative mt-2 max-h-40 w-fit">
                  <img src={imagePreview} alt="Preview" className="rounded shadow-md max-h-40" />
                  <button type="button" onClick={removeImage} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>


            {/* SEO Fields */}
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                name="metaTitle"
                value={seo.metaTitle}
                onChange={(e) =>
                  setSeo((prev) => ({ ...prev, metaTitle: e.target.value }))
                }
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                name="metaDescription"
                value={seo.metaDescription}
                onChange={(e) =>
                  setSeo((prev) => ({ ...prev, metaDescription: e.target.value }))
                }
                rows={3}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaKeywords">Meta Keywords (comma separated)</Label>
              <Input
                id="metaKeywords"
                name="metaKeywords"
                value={seo.metaKeywords}
                onChange={(e) =>
                  setSeo((prev) => ({ ...prev, metaKeywords: e.target.value }))
                }
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="focusKeywords">
                Focus Keywords (comma separated)
              </Label>
              <Input
                id="focusKeywords"
                name="focusKeywords"
                value={seo.focusKeywords}
                onChange={(e) =>
                  setSeo((prev) => ({
                    ...prev,
                    focusKeywords: e.target.value,
                  }))
                }
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
            </div>

            {/* General Error */}
            {"message" in (formState.error ?? {}) && (
              <p className="text-sm text-red-500">
                {(formState.error as any).message?.[0]}
              </p>
            )}

            <CardFooter className="flex justify-end border-none px-0 pt-0">
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isPending ? "Updating..." : "Update Blog"}
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
          <p>Blog updated successfully!</p>
          <DialogFooter>
            <Button
              onClick={() => {
                setSuccessDialogOpen(false);
                router.push("/admin/blogs");
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
