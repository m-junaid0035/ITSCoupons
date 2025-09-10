import { HomeDescription } from "@/models/HomeDescription";
import { IHomeDescription } from "@/models/HomeDescription";

/**
 * Convert a Mongoose document to a plain object safe for Client Components.
 */
const serializeHomeDescription = (doc: {
  _id: any;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}) => ({
  _id: doc._id.toString(),
  description: doc.description ?? "",
  createdAt: doc.createdAt?.toISOString?.() ?? null,
  updatedAt: doc.updatedAt?.toISOString?.() ?? null,
});

/**
 * Get latest home description (or null if none exists).
 */
export const getLatestHomeDescription = async (): Promise<
  ReturnType<typeof serializeHomeDescription> | null
> => {
  const doc = await HomeDescription.findOne().sort({ createdAt: -1 }).lean<IHomeDescription>();
  return doc ? serializeHomeDescription(doc) : null;
};

/**
 * Get home description by ID.
 */
export const getHomeDescriptionById = async (
  id: string
): Promise<ReturnType<typeof serializeHomeDescription> | null> => {
  const doc = await HomeDescription.findById(id).lean<IHomeDescription>();
  return doc ? serializeHomeDescription(doc) : null;
};

/**
 * Update (or create if none exists) home description.
 * - If `id` is provided, update that document.
 * - If `id` is not provided and none exists, create one.
 * - If `id` is not provided but one exists, update the latest one.
 */
export const upsertHomeDescription = async (
  description: string,
  id?: string
): Promise<ReturnType<typeof serializeHomeDescription>> => {
  let doc;

  if (id) {
    // Update specific document
    doc = await HomeDescription.findByIdAndUpdate(
      id,
      { $set: { description } },
      { new: true, runValidators: true, upsert: true }
    );
  } else {
    // Update latest if exists, otherwise create
    doc = await HomeDescription.findOneAndUpdate(
      {},
      { $set: { description } },
      { new: true, runValidators: true, upsert: true }
    );
  }

  return serializeHomeDescription(doc);
};
