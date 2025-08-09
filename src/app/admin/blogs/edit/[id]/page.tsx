"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useActionState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import {
  fetchBlogByIdAction,
  updateBlogAction,
} from "@/actions/blogActions"; // Adjust the path if needed

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

export default function EditBlogForm() {
  const params = useParams();
  const blogId = params.id as string;

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) =>
      await updateBlogAction(prevState, blogId, formData),
    initialState
  );

  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    async function loadData() {
      const res = await fetchBlogByIdAction(blogId);
      if (res?.data) {
        setBlog(res.data);
        if (res.data.date) setDate(new Date(res.data.date));
      }
      setLoading(false);
    }

    loadData();
  }, [blogId]);

  if (loading) return <p>Loading...</p>;
  if (!blog) return <p className="text-red-500">Blog not found</p>;

  const errorFor = (field: string) =>
    formState.error &&
    typeof formState.error === "object" &&
    field in formState.error
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;

  return (
    <form
      action={(formData) => {
        if (date) {
          formData.set("date", date.toISOString());
        }
        return dispatch(formData);
      }}
      className="space-y-6 max-w-2xl"
    >
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={blog.title} required />
        {errorFor("title") && <p className="text-sm text-red-500">{errorFor("title")}</p>}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" defaultValue={blog.slug} />
        {errorFor("slug") && <p className="text-sm text-red-500">{errorFor("slug")}</p>}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label>Date</Label>
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
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
        {errorFor("date") && <p className="text-sm text-red-500">{errorFor("date")}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={6}
          defaultValue={blog.description}
        />
        {errorFor("description") && (
          <p className="text-sm text-red-500">{errorFor("description")}</p>
        )}
      </div>

      {/* Image */}
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" accept="image/*" />
        {errorFor("image") && <p className="text-sm text-red-500">{errorFor("image")}</p>}
      </div>

      {/* Meta Title */}
      <div className="space-y-2">
        <Label htmlFor="metaTitle">Meta Title</Label>
        <Input id="metaTitle" name="metaTitle" defaultValue={blog.metaTitle} />
        {errorFor("metaTitle") && (
          <p className="text-sm text-red-500">{errorFor("metaTitle")}</p>
        )}
      </div>

      {/* Meta Description */}
      <div className="space-y-2">
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Textarea
          id="metaDescription"
          name="metaDescription"
          rows={3}
          defaultValue={blog.metaDescription}
        />
        {errorFor("metaDescription") && (
          <p className="text-sm text-red-500">{errorFor("metaDescription")}</p>
        )}
      </div>

      {/* Meta Keywords */}
      <div className="space-y-2">
        <Label htmlFor="metaKeywords">Meta Keywords (comma separated)</Label>
        <Input
          id="metaKeywords"
          name="metaKeywords"
          defaultValue={blog.metaKeywords?.join(", ") || ""}
        />
        {errorFor("metaKeywords") && (
          <p className="text-sm text-red-500">{errorFor("metaKeywords")}</p>
        )}
      </div>

      {/* Focus Keywords */}
      <div className="space-y-2">
        <Label htmlFor="focusKeywords">Focus Keywords (comma separated)</Label>
        <Input
          id="focusKeywords"
          name="focusKeywords"
          defaultValue={blog.focusKeywords?.join(", ") || ""}
        />
        {errorFor("focusKeywords") && (
          <p className="text-sm text-red-500">{errorFor("focusKeywords")}</p>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update Blog"}
      </Button>

      {/* General Error */}
      {"message" in (formState.error ?? {}) && (
        <p className="text-sm text-red-500">
          {(formState.error as any).message?.[0]}
        </p>
      )}
    </form>
  );
}
