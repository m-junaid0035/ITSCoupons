"use server";

import fs from "fs";
import path from "path";

// ✅ Directory to store event images
const eventDir = "/www/var/ITSCoupons-uploads/uploads-events";

// Ensure folder exists
if (!fs.existsSync(eventDir)) {
  fs.mkdirSync(eventDir, { recursive: true });
}

export async function saveEventImage(file: File): Promise<string> {
  if (!file) throw new Error("No file provided");

  // ✅ Use only the original filename (sanitize it)
  const fileName = file.name.replace(/\s+/g, "_");
  const filePath = path.join(eventDir, fileName);

  // ✅ Overwrite if file already exists
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Convert File → ArrayBuffer → Uint8Array
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  fs.writeFileSync(filePath, uint8Array);

  // ✅ Return clean relative path
  return `/uploads-events/${fileName}`;
}
