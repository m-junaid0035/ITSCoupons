"use server";

import fs from "fs";
import path from "path";

// ✅ Directory to store event images
const eventDir = "/www/var/ITSCoupons-uploads/uploads-events";

// Ensure folder exists
if (!fs.existsSync(eventDir)) fs.mkdirSync(eventDir, { recursive: true });

export async function saveEventImage(file: File): Promise<string> {
  if (!file) throw new Error("No file provided");

  // Sanitize original filename
  const originalName = file.name.replace(/\s+/g, "_"); // replace spaces with underscores

  // Append timestamp to filename to avoid overwriting
  const timestamp = Date.now();
  const fileName = `${timestamp}-${originalName}`;
  const filePath = path.join(eventDir, fileName);

  // Convert File → ArrayBuffer → Uint8Array
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  fs.writeFileSync(filePath, uint8Array);

  // Return relative path for frontend/DB
  return `/uploads-events/${fileName}`;
}
