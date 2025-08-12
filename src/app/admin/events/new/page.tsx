"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react"; // adjust import if needed
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
import { toast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const errorFor = (field: string) => {
    return formState.error &&
      typeof formState.error === "object" &&
      field in formState.error
      ? (formState.error as FieldErrors)[field]?.[0]
      : null;
  };

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

  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800 pt-4">
        <CardHeader className="flex items-center justify-between border-none">
          <CardTitle>Create Event</CardTitle>
          <Button variant="secondary" onClick={() => router.push("/admin/events")}>
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
              <Input
                id="title"
                name="title"
                required
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="Enter event title"
              />
              {errorFor("title") && (
                <p className="text-sm text-red-500">{errorFor("title")}</p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (optional)</Label>
              <Input
                id="slug"
                name="slug"
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="example-event-slug"
              />
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
                      "w-full justify-start text-left font-normal border-none shadow-sm bg-gray-50 dark:bg-gray-700",
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
              <Textarea
                id="description"
                name="description"
                rows={6}
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="Write event description here..."
              />
              {errorFor("description") && (
                <p className="text-sm text-red-500">{errorFor("description")}</p>
              )}
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                type="text"
                placeholder="https://example.com/image.jpg"
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
              />
              {errorFor("image") && (
                <p className="text-sm text-red-500">{errorFor("image")}</p>
              )}
            </div>

            {/* Meta Title */}
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                name="metaTitle"
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="SEO meta title"
              />
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
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="SEO meta description"
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
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="keyword1, keyword2, keyword3"
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
                className="border-none shadow-sm bg-gray-50 dark:bg-gray-700"
                placeholder="focus1, focus2"
              />
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

      {/* Success Confirmation Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>Event created successfully!</p>
          <DialogFooter>
            <Button
              onClick={() => {
                setSuccessDialogOpen(false);
                router.push("/admin/events");
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
