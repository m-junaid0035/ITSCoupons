"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useActionState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { fetchEventByIdAction, updateEventAction } from "@/actions/eventActions";

interface FormState {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
}

const initialState: FormState = {
  error: {},
};

export default function EditEventForm() {
  const params = useParams();
  const eventId = params.id as string;

  const [formState, dispatch, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) =>
      await updateEventAction(prevState, eventId, formData),
    initialState
  );

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    async function loadEvent() {
      const res = await fetchEventByIdAction(eventId);
      if (res?.data) {
        setEvent(res.data);
        if (res.data.date) {
          setEventDate(new Date(res.data.date));
        }
      }
      setLoading(false);
    }
    loadEvent();
  }, [eventId]);

  const errorFor = (field: string) =>
    formState.error &&
    typeof formState.error === "object" &&
    field in formState.error
      ? (formState.error as Record<string, string[]>)[field]?.[0]
      : null;

  if (loading) return <p>Loading...</p>;
  if (!event) return <p className="text-red-500">Event not found</p>;

  return (
    <form
      action={(formData) => {
        if (eventDate) {
          formData.set("date", eventDate.toISOString());
        }
        return dispatch(formData);
      }}
      className="space-y-6 max-w-2xl"
    >
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={event.title} required />
        {errorFor("title") && <p className="text-sm text-red-500">{errorFor("title")}</p>}
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
        {errorFor("date") && <p className="text-sm text-red-500">{errorFor("date")}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={event.description}
        />
        {errorFor("description") && (
          <p className="text-sm text-red-500">{errorFor("description")}</p>
        )}
      </div>

      {/* Image */}
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input id="image" name="image" type="file" accept="image/*" />
        {errorFor("image") && <p className="text-sm text-red-500">{errorFor("image")}</p>}
      </div>

      {/* Meta Title */}
      <div className="space-y-2">
        <Label htmlFor="metaTitle">Meta Title</Label>
        <Input id="metaTitle" name="metaTitle" defaultValue={event.metaTitle} />
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
          rows={2}
          defaultValue={event.metaDescription}
        />
        {errorFor("metaDescription") && (
          <p className="text-sm text-red-500">{errorFor("metaDescription")}</p>
        )}
      </div>

      {/* Meta Keywords */}
      <div className="space-y-2">
        <Label htmlFor="metaKeywords">Meta Keywords</Label>
        <Input
          id="metaKeywords"
          name="metaKeywords"
          defaultValue={event.metaKeywords}
        />
        {errorFor("metaKeywords") && (
          <p className="text-sm text-red-500">{errorFor("metaKeywords")}</p>
        )}
      </div>

      {/* Focus Keywords */}
      <div className="space-y-2">
        <Label htmlFor="focusKeywords">Focus Keywords</Label>
        <Input
          id="focusKeywords"
          name="focusKeywords"
          defaultValue={event.focusKeywords}
        />
        {errorFor("focusKeywords") && (
          <p className="text-sm text-red-500">{errorFor("focusKeywords")}</p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" defaultValue={event.slug} />
        {errorFor("slug") && <p className="text-sm text-red-500">{errorFor("slug")}</p>}
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update Event"}
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
