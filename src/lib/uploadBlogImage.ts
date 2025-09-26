"use server";

import fs from "fs";
import path from "path";

// ✅ Directory to store blog images
const blogDir = "/www/var/ITSCoupons-uploads/uploads-blogs";

// Ensure folder exists
if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });

export async function saveBlogImage(file: File): Promise<string> {
  if (!file) throw new Error("No file provided");

  // Sanitize original filename
  const originalName = file.name.replace(/\s+/g, "_"); // replace spaces with underscores

  // Append timestamp to filename to avoid overwrites
  const timestamp = Date.now();
  const fileName = `${timestamp}-${originalName}`;
  const filePath = path.join(blogDir, fileName);

  // Convert File → ArrayBuffer → Uint8Array
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  fs.writeFileSync(filePath, uint8Array);

  // Return public path
  return `/uploads-blogs/${fileName}`;
}
