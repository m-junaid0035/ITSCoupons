"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { createEventAction } from "@/actions/eventActions";

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

export default function EventCreatePage() {
  const router = useRouter();
  const [formState, dispatch, isPending] = useActionState(
    createEventAction,
    initialState
  );
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);

  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as FieldErrors)[field]?.[0]
      : null;
  };

  // Redirect after successful event creation
  useEffect(() => {
    if (formState.data && !formState.error) {
      router.push("/admin/events");
    }
  }, [formState, router]);

  return (
    <Card className="max-w-3xl mx-auto shadow-lg bg-white">
      <CardHeader className="flex items-center justify-between border-none">
        <CardTitle>Create Event</CardTitle>
        <Button
          variant="secondary"
          onClick={() => router.push("/admin/events")}
        >
          Back to Events
        </Button>
      </CardHeader>

      <CardContent>
        <form
          action={(formData) => {
            if (eventDate) {
              formData.set("date", eventDate.toISOString());
            }
            return dispatch(formData);
          }}
          className="space-y-6"
        >
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required className="border-none shadow-sm" />
            {errorFor("title") && (
              <p className="text-sm text-red-500">{errorFor("title")}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" className="border-none shadow-sm" />
            {errorFor("slug") && (
              <p className="text-sm text-red-500">{errorFor("slug")}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-none shadow-sm",
                    !eventDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {eventDate ? format(eventDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={eventDate}
                  onSelect={setEventDate}
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
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={6} className="border-none shadow-sm" />
            {errorFor("description") && (
              <p className="text-sm text-red-500">{errorFor("description")}</p>
            )}
          </div>

          {/* Image URL (changed from file input) */}
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              name="image"
              type="text"
              placeholder="https://example.com/image.jpg"
              className="border-none shadow-sm"
            />
            {errorFor("image") && (
              <p className="text-sm text-red-500">{errorFor("image")}</p>
            )}
          </div>

          {/* Meta Title */}
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input id="metaTitle" name="metaTitle" className="border-none shadow-sm" />
            {errorFor("metaTitle") && (
              <p className="text-sm text-red-500">{errorFor("metaTitle")}</p>
            )}
          </div>

          {/* Meta Description */}
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea id="metaDescription" name="metaDescription" rows={3} className="border-none shadow-sm" />
            {errorFor("metaDescription") && (
              <p className="text-sm text-red-500">{errorFor("metaDescription")}</p>
            )}
          </div>

          {/* Meta Keywords */}
          <div className="space-y-2">
            <Label htmlFor="metaKeywords">Meta Keywords</Label>
            <Input id="metaKeywords" name="metaKeywords" placeholder="keyword1, keyword2" className="border-none shadow-sm" />
            {errorFor("metaKeywords") && (
              <p className="text-sm text-red-500">{errorFor("metaKeywords")}</p>
            )}
          </div>

          {/* Focus Keywords */}
          <div className="space-y-2">
            <Label htmlFor="focusKeywords">Focus Keywords</Label>
            <Input id="focusKeywords" name="focusKeywords" placeholder="focus1, focus2" className="border-none shadow-sm" />
            {errorFor("focusKeywords") && (
              <p className="text-sm text-red-500">{errorFor("focusKeywords")}</p>
            )}
          </div>

          {/* General Error */}
          {"message" in (formState.error ?? {}) && (
            <p className="text-sm text-red-500">
              {(formState.error as any).message?.[0]}
            </p>
          )}

          {/* Footer */}
          <CardFooter className="flex justify-end border-none">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Saving..." : "Save Event"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
