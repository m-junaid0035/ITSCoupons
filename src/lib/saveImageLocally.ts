"use server";

import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";

// ✅ Directory to store user profile images
const uploadsDir = "/www/var/ITSCoupons-uploads/uploads-users";

// Ensure folder exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function saveUserProfileImage(file: File): Promise<string> {
  if (!file) throw new Error("No file provided");

  // ✅ Use only the original filename (sanitize it)
  const filename = file.name.replace(/\s+/g, "_");

  const filePath = path.join(uploadsDir, filename);

  // Optional: if file already exists, remove or overwrite
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath); // remove existing file
  }

  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  await writeFile(filePath, uint8Array);

  // ✅ Return the public path
  return `/uploads-users/${filename}`;
}
