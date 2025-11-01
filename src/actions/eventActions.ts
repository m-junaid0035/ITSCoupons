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
import { saveEventImage } from "@/lib/uploadEventImage";

/* ---------------------------- 📝 Validation Schema ---------------------------- */
const eventSchema = z.object({
  title: z.string().min(3).max(100, "Title too long"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  description: z.string().optional(),
  image: z.string().min(1, "Image is required"), // only path is saved in DB
  metaTitle: z.string().max(100).optional(),
  metaDescription: z.string().max(200).optional(),
  metaKeywords: z.string().optional(),
  focusKeywords: z.string().optional(),
  slug: z.string().optional(),
  store: z.string().optional(), // 👈 new store field
});

type EventFormData = z.infer<typeof eventSchema> & {
  imageFile?: File; // ✅ allow raw File separately
};

/* ---------------------------- 📦 Form State ---------------------------- */
export type EventFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

/* ---------------------------- 🛠️ Helper Parser ---------------------------- */
async function parseEventFormData(
  formData: FormData,
  requireImage: boolean = true
): Promise<EventFormData> {
  const uploadedFile = formData.get("imageFile") as File | null;

  let imagePath: string | undefined = undefined;

  if (uploadedFile && uploadedFile.size > 0) {
    console.log("junaid 1 if else", uploadedFile)
    imagePath = await saveEventImage(uploadedFile);
  } else {
    const existingImage = formData.get("image")?.toString().trim();
    if (existingImage) {
      console.log("junaid 2 if else", existingImage)
      console.log("junaid 2 if else", uploadedFile)
      imagePath = existingImage;
    } else if (requireImage) {
      throw new Error("Image is required");
    }
  }
  console.log("there is the whole out of te if else", uploadedFile)

  return {
    title: String(formData.get("title") || ""),
    date: String(formData.get("date") || ""),
    description: formData.get("description")
      ? String(formData.get("description"))
      : undefined,
    image: imagePath || "",
    metaTitle: formData.get("metaTitle")
      ? String(formData.get("metaTitle"))
      : undefined,
    metaDescription: formData.get("metaDescription")
      ? String(formData.get("metaDescription"))
      : undefined,
    metaKeywords: formData.get("metaKeywords")
      ? String(formData.get("metaKeywords"))
      : undefined,
    focusKeywords: formData.get("focusKeywords")
      ? String(formData.get("focusKeywords"))
      : undefined,
    slug: formData.get("slug") ? String(formData.get("slug")) : undefined,
    store: formData.get("store") ? String(formData.get("store")) : undefined, // 👈 parse store
    imageFile: uploadedFile || undefined,
  };
}

/* ---------------------------- 🔹 CREATE ---------------------------- */
export async function createEventAction(
  prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  await connectToDatabase();

  try {
    const parsed = await parseEventFormData(formData, true);
    const result = eventSchema.safeParse(parsed);

    if (!result.success) return { error: result.error.flatten().fieldErrors };

    const event = await createEvent({
      ...result.data,
      image: parsed.image,
    });

    return { data: event };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to create event"] } };
  }
}

/* ---------------------------- 🔹 UPDATE ---------------------------- */
export async function updateEventAction(
  prevState: EventFormState,
  id: string,
  formData: FormData
): Promise<EventFormState> {
  await connectToDatabase();

  try {
    const parsed = await parseEventFormData(formData, false);
    const result = eventSchema.safeParse(parsed);

    if (!result.success) return { error: result.error.flatten().fieldErrors };

    const updated = await updateEvent(id, {
      ...result.data,
      image: parsed.image,
      imageFile: parsed.imageFile,
    });

    if (!updated) return { error: { message: ["Event not found"] } };
    return { data: updated };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to update event"] } };
  }
}

/* ---------------------------- 🔹 DELETE ---------------------------- */
export async function deleteEventAction(id: string) {
  await connectToDatabase();
  try {
    const deleted = await deleteEvent(id);
    if (!deleted) return { error: { message: ["Event not found"] } };
    return { data: deleted };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to delete event"] } };
  }
}

/* ---------------------------- 🔹 FETCHES ---------------------------- */
export async function fetchAllEventsAction() {
  await connectToDatabase();
  try {
    return { data: await getAllEvents() };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch events"] } };
  }
}

export async function fetchEventByIdAction(id: string) {
  await connectToDatabase();
  try {
    const event = await getEventById(id);
    if (!event) return { error: { message: ["Event not found"] } };
    return { data: event };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch event"] } };
  }
}
