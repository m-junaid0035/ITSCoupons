import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

/**
 * Saves an uploaded image locally to the /public/uploads directory.
 * @param file The uploaded file (from a form with enctype multipart/form-data)
 * @returns The relative path to the saved image (e.g., /uploads/filename.jpg)
 */
export async function saveUserProfileImage(file: File): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Cast Buffer to Uint8Array for TypeScript
  const uint8Buffer = new Uint8Array(buffer);

  const ext = file.name.split(".").pop();
  const filename = `${randomUUID()}.${ext}`;
  const filePath = path.join(uploadsDir, filename);

  await writeFile(filePath, uint8Buffer); // ✅ pass Uint8Array

  return `/uploads/${filename}`;
}
