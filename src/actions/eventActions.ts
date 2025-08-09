"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  updateEvent,
} from "@/functions/eventFunctions";

// ✅ Event Validation Schema
const eventSchema = z.object({
  title: z.string().min(3).max(100, "Title too long"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  description: z.string().optional(),
  image: z.string().optional(), // Store image path or URL
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  metaKeywords: z.string().optional(),
  focusKeywords: z.string().optional(),
  slug: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

export type EventFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

// ✅ Helper: Parse FormData to EventFormData
function parseEventFormData(formData: FormData): EventFormData {
  return {
    title: String(formData.get("title") || ""),
    date: String(formData.get("date") || ""),
    description: String(formData.get("description") || ""),
    image: String(formData.get("image") || ""),
    metaTitle: String(formData.get("metaTitle") || ""),
    metaDescription: String(formData.get("metaDescription") || ""),
    metaKeywords: String(formData.get("metaKeywords") || ""),
    focusKeywords: String(formData.get("focusKeywords") || ""),
    slug: String(formData.get("slug") || ""),
  };
}

// ✅ CREATE EVENT
export async function createEventAction(
  prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  await connectToDatabase();

  const parsed = parseEventFormData(formData);
  const result = eventSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const event = await createEvent(result.data);
    return { data: event };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to create event"] } };
  }
}

// ✅ UPDATE EVENT
export async function updateEventAction(
  prevState: EventFormState,
  id: string,
  formData: FormData
): Promise<EventFormState> {
  await connectToDatabase();

  const parsed = parseEventFormData(formData);
  const result = eventSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const updated = await updateEvent(id, result.data);
    return { data: updated };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to update event"] } };
  }
}

// ✅ DELETE EVENT
export async function deleteEventAction(id: string) {
  await connectToDatabase();
  try {
    const deleted = await deleteEvent(id);
    return { data: deleted };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to delete event"] } };
  }
}

// ✅ FETCH ALL EVENTS
export async function fetchAllEventsAction() {
  await connectToDatabase();
  try {
    const events = await getAllEvents();
    return { data: events };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch events"] } };
  }
}

// ✅ FETCH SINGLE EVENT
export async function fetchEventByIdAction(id: string) {
  await connectToDatabase();
  try {
    const event = await getEventById(id);
    if (!event) {
      return { error: { message: ["Event not found"] } };
    }
    return { data: event };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch event"] } };
  }
}
