"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import {
  createSubscriber,
  deleteSubscriber,
  getAllSubscribers,
  getSubscriberById,
  updateSubscriber,
  getSubscriberByEmail,
} from "@/functions/subscriberFunctions";

// ✅ Subscriber Validation Schema
const subscriberSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

export type SubscriberFormState = {
  error?: Record<string, string[]> | { message?: string[] };
  data?: any;
};

// ✅ Helper: Parse FormData to Subscriber input
function parseSubscriberFormData(formData: FormData) {
  return {
    email: String(formData.get("email") || ""),
  };
}

// ✅ CREATE SUBSCRIBER
export async function createSubscriberAction(
  prevState: SubscriberFormState,
  formData: FormData
): Promise<SubscriberFormState> {
  await connectToDatabase();

  const parsed = parseSubscriberFormData(formData);
  const result = subscriberSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    // Prevent duplicate emails
    const existing = await getSubscriberByEmail(result.data.email);
    if (existing) {
      return { error: { email: ["Email already subscribed"] } };
    }

    const subscriber = await createSubscriber(result.data);
    return { data: subscriber };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to create subscriber"] } };
  }
}

// ✅ UPDATE SUBSCRIBER
export async function updateSubscriberAction(
  prevState: SubscriberFormState,
  id: string,
  formData: FormData
): Promise<SubscriberFormState> {
  await connectToDatabase();

  const parsed = parseSubscriberFormData(formData);
  const result = subscriberSchema.safeParse(parsed);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const updated = await updateSubscriber(id, result.data);
    return { data: updated };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to update subscriber"] } };
  }
}

// ✅ DELETE SUBSCRIBER
export async function deleteSubscriberAction(id: string) {
  await connectToDatabase();
  try {
    const deleted = await deleteSubscriber(id);
    return { data: deleted };
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to delete subscriber"] } };
  }
}

// ✅ FETCH ALL SUBSCRIBERS
export async function fetchAllSubscribersAction() {
  await connectToDatabase();
  try {
    const subscribers = await getAllSubscribers();
    return { data: subscribers }; // already serialized
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch subscribers"] } };
  }
}

// ✅ FETCH SINGLE SUBSCRIBER
export async function fetchSubscriberByIdAction(id: string) {
  await connectToDatabase();
  try {
    const subscriber = await getSubscriberById(id);
    if (!subscriber) {
      return { error: { message: ["Subscriber not found"] } };
    }
    return { data: subscriber }; // already plain object
  } catch (error: any) {
    return { error: { message: [error.message || "Failed to fetch subscriber"] } };
  }
}
