"use client";

import { useEffect, useState } from "react";
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

import { createBlogAction } from "@/actions/blogActions"; // adjust path as needed

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

export default function BlogForm() {
  const [formState, dispatch, isPending] = useActionState(createBlogAction, initialState);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as FieldErrors)[field]?.[0]
      : null;
  };

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
        <Input id="title" name="title" required />
        {errorFor("title") && <p className="text-sm text-red-500">{errorFor("title")}</p>}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">Slug (optional)</Label>
        <Input id="slug" name="slug" />
        {errorFor("slug") && <p className="text-sm text-red-500">{errorFor("slug")}</p>}
      </div>

      {/* Date Picker */}
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
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errorFor("date") && <p className="text-sm text-red-500">{errorFor("date")}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={6} />
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
        <Input id="metaTitle" name="metaTitle" />
        {errorFor("metaTitle") && <p className="text-sm text-red-500">{errorFor("metaTitle")}</p>}
      </div>

      {/* Meta Description */}
      <div className="space-y-2">
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Textarea id="metaDescription" name="metaDescription" rows={3} />
        {errorFor("metaDescription") && (
          <p className="text-sm text-red-500">{errorFor("metaDescription")}</p>
        )}
      </div>

      {/* Meta Keywords */}
      <div className="space-y-2">
        <Label htmlFor="metaKeywords">Meta Keywords (comma separated)</Label>
        <Input id="metaKeywords" name="metaKeywords" />
        {errorFor("metaKeywords") && (
          <p className="text-sm text-red-500">{errorFor("metaKeywords")}</p>
        )}
      </div>

      {/* Focus Keywords */}
      <div className="space-y-2">
        <Label htmlFor="focusKeywords">Focus Keywords (comma separated)</Label>
        <Input id="focusKeywords" name="focusKeywords" />
        {errorFor("focusKeywords") && (
          <p className="text-sm text-red-500">{errorFor("focusKeywords")}</p>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Blog"}
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
