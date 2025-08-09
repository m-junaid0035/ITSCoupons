import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

/**
 * Saves an uploaded image locally to the /public/uploads directory.
 * @param file The uploaded file (from a form with enctype multipart/form-data)
 * @returns The relative path to the saved image (e.g., /uploads/filename.jpg)
 */
export async function saveImageLocally(file: File): Promise<string> {
  // Ensure the directory exists
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  // Read file buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Get extension and unique file name
  const ext = file.name.split(".").pop();
  const filename = `${randomUUID()}.${ext}`;
  const filePath = path.join(uploadsDir, filename);

  // Save the file
  await writeFile(filePath, buffer);

  // Return the public path to the file
  return `/uploads/${filename}`;
}
