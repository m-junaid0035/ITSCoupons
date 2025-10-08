import { Types } from "mongoose";
import { Event } from "@/models/Event"; // adjust path based on your project
import { saveEventImage } from "@/lib/uploadEventImage"; // 👈 helper for saving event images

/**
 * Helper to sanitize and format incoming event data.
 */
const sanitizeEventData = async (data: {
  title: string;
  date: string;
  description?: string;
  image?: File | string; // 👈 allow File or string
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  focusKeywords?: string;
  slug?: string;
  store?: string; // 👈 new store field
}) => {
  let imagePath: string | undefined = undefined;

  if (data.image instanceof File) {
    // 👈 Save locally if file
    imagePath = await saveEventImage(data.image);
  } else if (typeof data.image === "string") {
    imagePath = data.image.trim();
  }

  return {
    title: data.title.trim(),
    date: new Date(data.date),
    description: data.description?.trim(),
    image: imagePath,
    metaTitle: data.metaTitle?.trim(),
    metaDescription: data.metaDescription?.trim(),
    metaKeywords: data.metaKeywords?.trim(),
    focusKeywords: data.focusKeywords?.trim(),
    slug: data.slug?.trim(),
    store: data.store ? new Types.ObjectId(data.store) : undefined, // 👈 convert to ObjectId
  };
};

/**
 * Convert a Mongoose document to a plain object safe for Client Components.
 */
const serializeEvent = (event: any) => ({
  _id: event._id.toString(),
  title: event.title,
  date: event.date?.toISOString?.(),
  description: event.description,
  image: event.image,
  metaTitle: event.metaTitle,
  metaDescription: event.metaDescription,
  metaKeywords: event.metaKeywords,
  focusKeywords: event.focusKeywords,
  slug: event.slug,
  store: event.store?.toString(), // 👈 serialize store ObjectId
  createdAt: event.createdAt?.toISOString?.(),
  updatedAt: event.updatedAt?.toISOString?.(),
});

/**
 * Create a new event.
 */
export const createEvent = async (data: {
  title: string;
  date: string;
  description?: string;
  image?: File | string; // 👈 supports both
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  focusKeywords?: string;
  slug?: string;
  store?: string; // 👈 new store
}): Promise<ReturnType<typeof serializeEvent>> => {
  const eventData = await sanitizeEventData(data);
  const event = await new Event(eventData).save();
  return serializeEvent(event);
};

/**
 * Get all events, sorted by newest first.
 */
export const getAllEvents = async (): Promise<
  ReturnType<typeof serializeEvent>[]
> => {
  const events = await Event.find().sort({ createdAt: -1 }).lean();
  return events.map(serializeEvent);
};

/**
 * Get an event by its ID.
 */
export const getEventById = async (
  id: string
): Promise<ReturnType<typeof serializeEvent> | null> => {
  const event = await Event.findById(id).lean();
  return event ? serializeEvent(event) : null;
};

/**
 * Update an event by ID.
 */
export const updateEvent = async (
  id: string,
  data: {
    title: string;
    date: string;
    description?: string;
    image?: File | string; // 👈 can upload new file or keep old string
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    focusKeywords?: string;
    slug?: string;
    store?: string; // 👈 new store
  }
): Promise<ReturnType<typeof serializeEvent> | null> => {
  const updatedData = await sanitizeEventData(data);
  const event = await Event.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  ).lean();
  return event ? serializeEvent(event) : null;
};

/**
 * Delete an event by ID.
 */
export const deleteEvent = async (
  id: string
): Promise<ReturnType<typeof serializeEvent> | null> => {
  const event = await Event.findByIdAndDelete(id).lean();
  return event ? serializeEvent(event) : null;
};
