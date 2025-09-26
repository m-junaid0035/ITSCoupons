"use server";

import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";

// ✅ Directory to store user profile images
const uploadsDir = "/www/var/ITSCoupons-uploads/uploads-users";

// Ensure folder exists
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

export async function saveUserProfileImage(file: File): Promise<string> {
  if (!file) throw new Error("No file provided");

  // Sanitize original filename
  const originalName = file.name.replace(/\s+/g, "_"); // replace spaces with underscores

  // Append timestamp to filename to avoid overwrites
  const timestamp = Date.now();
  const filename = `${timestamp}-${originalName}`;
  const filePath = path.join(uploadsDir, filename);

  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  await writeFile(filePath, uint8Array);

  // Return public path
  return `/uploads-users/${filename}`;
}
