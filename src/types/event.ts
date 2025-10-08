import type { StoreData } from "./store";

/* ───────── Input type ───────── */
export interface EventInput {
  title: string;
  date: string; // ISO string format
  description?: string;
  image?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  focusKeywords?: string;
  slug?: string;
  store?: string; // ✅ Store ID reference when creating/updating
}

/* ───────── Base Event Data from API ───────── */
export interface EventData {
  _id: string;
  title: string;
  date?: string | null; // ISO string
  description?: string;
  image?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  focusKeywords?: string;
  slug?: string;
  store?: string; // ✅ Store ID from API
  createdAt?: string | null;
  updatedAt?: string | null;
}

/* ───────── Extended Event with Store object ───────── */
export type EventWithStore = Omit<EventData, "store"> & {
  store: StoreData | null;
};

/* ───────── Response Types ───────── */
export type EventListResponse = EventData[];
export type EventSingleResponse = EventData | null;
