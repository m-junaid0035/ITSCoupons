"use client";

import { useEffect, useState, startTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActionState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2, X } from "lucide-react";
import { format } from "date-fns";
import LoadingSkeleton from "./loading";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { fetchEventByIdAction, updateEventAction } from "@/actions/eventActions";
import { fetchLatestSEOAction } from "@/actions/seoActions"; // ✅ added
import { toast } from "@/hooks/use-toast";
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

export default function EditEventForm() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) =>
      await updateEventAction(prevState, eventId, formData),
    initialState
  );

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [descriptionHtml, setDescriptionHtml] = useState("");
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  // --- Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ✅ SEO State
  const [seo, setSeo] = useState({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    focusKeywords: "",
    slug: "",
  });

  const [title, setTitle] = useState("");

  useEffect(() => {
    async function loadEvent() {
      const res = await fetchEventByIdAction(eventId);
      if (res?.data) {
        setEvent(res.data);
        setDescriptionHtml(res.data.description || "");
        setTitle(res.data.title || "");
        if (res.data.date) setEventDate(new Date(res.data.date));
        if (res.data.image) setImagePreview(res.data.image);

        // ✅ Populate SEO state
        setSeo({
          metaTitle: res.data.metaTitle || "",
          metaDescription: res.data.metaDescription || "",
          metaKeywords: res.data.metaKeywords || "",
          focusKeywords: res.data.focusKeywords || "",
          slug: res.data.slug || "",
        });
      }
      setLoading(false);
    }
    loadEvent();
  }, [eventId]);

  // ✅ Auto SEO update when title changes
  const updateSEO = async (eventTitle: string) => {
    const { data: latestSEO } = await fetchLatestSEOAction("events");
    if (!latestSEO) return;

    const replaceEventTitle = (text: string) =>
      text.replace(/{{blogTitle}}|s_n/gi, eventTitle);

    const slugSource = latestSEO.slug || eventTitle;
    const processedSlug = replaceEventTitle(slugSource)
      .toLowerCase()
      .replace(/\s+/g, "_");

    setSeo({
      metaTitle: replaceEventTitle(latestSEO.metaTitle || ""),
      metaDescription: replaceEventTitle(latestSEO.metaDescription || ""),
      metaKeywords: (latestSEO.metaKeywords || [])
        .map(replaceEventTitle)
        .join(", "),
      focusKeywords: (latestSEO.focusKeywords || [])
        .map(replaceEventTitle)
        .join(", "),
      slug: processedSlug,
    });
  };

  useEffect(() => {
    if (title.trim()) {
      updateSEO(title);
    }
  }, [title]);

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

  const errorFor = (field: string) =>
    formState.error &&
    typeof formState.error === "object" &&
    field in formState.error
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  if (loading) return <LoadingSkeleton />;
  if (!event) return <p className="text-red-500">Event not found</p>;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (eventDate) formData.set("date", eventDate.toISOString());
    formData.set("description", descriptionHtml);
    formData.set("title", title);

    if (imageFile) {
      formData.set("imageFile", imageFile);
    } else if (imagePreview) {
      formData.set("image", imagePreview);
    }

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
          <CardTitle className="text-lg sm:text-xl font-semibold">Edit Event</CardTitle>
          <Button variant="secondary" onClick={() => router.push("/admin/events")}>
            Back to Events
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("title") && <p className="text-sm text-red-500">{errorFor("title")}</p>}
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={seo.slug}
                onChange={(e) => setSeo((prev) => ({ ...prev, slug: e.target.value }))}
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
                    className={cn(
                      "w-full justify-start text-left font-normal border-none shadow-sm bg-gray-50 dark:bg-gray-700",
                      !eventDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {eventDate ? format(eventDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={eventDate} onSelect={setEventDate} initialFocus />
                </PopoverContent>
              </Popover>
              {errorFor("date") && <p className="text-sm text-red-500">{errorFor("date")}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <RichTextEditor value={descriptionHtml} onChange={setDescriptionHtml} />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="imageFile">Event Image</Label>
              <Input
                id="imageFile"
                name="imageFile"
                type="file"
                accept="image/*"
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="relative mt-2 max-h-40 w-fit">
                  <img src={imagePreview} alt="Preview" className="rounded shadow-md max-h-40" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              {errorFor("image") && <p className="text-sm text-red-500">{errorFor("image")}</p>}
            </div>

            {/* SEO Fields */}
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                name="metaTitle"
                value={seo.metaTitle}
                onChange={(e) => setSeo((prev) => ({ ...prev, metaTitle: e.target.value }))}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                name="metaDescription"
                value={seo.metaDescription}
                onChange={(e) => setSeo((prev) => ({ ...prev, metaDescription: e.target.value }))}
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
                onChange={(e) => setSeo((prev) => ({ ...prev, metaKeywords: e.target.value }))}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="focusKeywords">Focus Keywords (comma separated)</Label>
              <Input
                id="focusKeywords"
                name="focusKeywords"
                value={seo.focusKeywords}
                onChange={(e) => setSeo((prev) => ({ ...prev, focusKeywords: e.target.value }))}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
            </div>

            {/* General Error */}
            {"message" in (formState.error ?? {}) && (
              <p className="text-sm text-red-500">{(formState.error as any).message?.[0]}</p>
            )}

            <CardFooter className="flex justify-end border-none">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Updating..." : "Update Event"}
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
          <p>Event updated successfully!</p>
          <DialogFooter>
            <Button onClick={() => { setSuccessDialogOpen(false); router.push("/admin/events"); }}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
