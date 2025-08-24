"use server";

import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";

// ✅ Directory to store user profile images
const uploadsDir = "www/var/ITSCoupons-uploads/users";

// Ensure folder exists
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

export async function saveUserProfileImage(file: File): Promise<string> {
  if (!file) throw new Error("No file provided");

  const ext = path.extname(file.name) || ".jpg";
  const filename = `u-${uuidv4()}${ext}`;
  const filePath = path.join(uploadsDir, filename);

  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  await writeFile(filePath, uint8Array);

  // Return public path
  return `/uploads-users/${filename}`;
}
