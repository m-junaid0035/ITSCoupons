// types/event.ts

// Input type for creating/updating an event
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
}

// Output type for an event returned from API
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
  createdAt?: string | null;
  updatedAt?: string | null;
}

// List response type
export type EventListResponse = EventData[];

// Single response type
export type EventSingleResponse = EventData | null;
