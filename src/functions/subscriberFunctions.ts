import { Types } from "mongoose";
import { Subscriber, ISubscriber } from "@/models/Subscriber";

/**
 * Helper to sanitize and format incoming subscriber data.
 */
const sanitizeSubscriberData = (data: { email: string }) => ({
  email: data.email.trim().toLowerCase(),
});

/**
 * Convert a Mongoose document (or lean result) to a plain object safe for Client Components.
 */
const serializeSubscriber = (subscriber: ISubscriber | { _id: Types.ObjectId | string; email: string; createdAt: Date; updatedAt: Date }) => ({
  _id: subscriber._id.toString(),
  email: subscriber.email,
  createdAt: subscriber.createdAt?.toISOString?.(),
  updatedAt: subscriber.updatedAt?.toISOString?.(),
});

/**
 * Create a new subscriber only if it does not already exist.
 */
export const createSubscriber = async (data: { email: string }) => {
  const subscriberData = sanitizeSubscriberData(data);

  // Check if subscriber already exists
  let subscriber = await Subscriber.findOne({ email: subscriberData.email }).lean<ISubscriber>();
  if (subscriber) {
    return serializeSubscriber(subscriber); // return existing
  }

  // Create new if not exists
  subscriber = await new Subscriber(subscriberData).save();
  return serializeSubscriber(subscriber);
};

/**
 * Get all subscribers.
 */
export const getAllSubscribers = async () => {
  const subscribers = await Subscriber.find()
    .sort({ createdAt: -1 })
    .lean<ISubscriber[]>();
  return subscribers.map((sub) => serializeSubscriber(sub));
};

/**
 * Get subscriber by ID.
 */
export const getSubscriberById = async (id: string) => {
  const subscriber = await Subscriber.findById(id).lean<ISubscriber>();
  return subscriber ? serializeSubscriber(subscriber) : null;
};

/**
 * Update subscriber by ID.
 */
export const updateSubscriber = async (id: string, data: { email: string }) => {
  const updatedData = sanitizeSubscriberData(data);
  const subscriber = await Subscriber.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  ).lean<ISubscriber>();
  return subscriber ? serializeSubscriber(subscriber) : null;
};

/**
 * Delete subscriber by ID.
 */
export const deleteSubscriber = async (id: string) => {
  const subscriber = await Subscriber.findByIdAndDelete(id).lean<ISubscriber>();
  return subscriber ? serializeSubscriber(subscriber) : null;
};

/**
 * Get subscriber by email.
 */
export const getSubscriberByEmail = async (email: string) => {
  const subscriber = await Subscriber.findOne({ email: email.toLowerCase() }).lean<ISubscriber>();
  return subscriber ? serializeSubscriber(subscriber) : null;
};
