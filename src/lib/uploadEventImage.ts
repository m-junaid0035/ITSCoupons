"use server";

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// ✅ Directory to store event images
const eventDir = "/www/var/ITSCoupons-uploads/uploads-events";

// Ensure folder exists
if (!fs.existsSync(eventDir)) fs.mkdirSync(eventDir, { recursive: true });

export async function saveEventImage(file: File): Promise<string> {
  if (!file) throw new Error("No file provided");

  const ext = path.extname(file.name) || ".jpg"; // default jpg if missing
  const fileName = `e-${uuidv4()}${ext}`; // UUID-based filename
  const filePath = path.join(eventDir, fileName);

  // Convert File → ArrayBuffer → Uint8Array
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  fs.writeFileSync(filePath, uint8Array);

  // Return relative path for frontend/DB
  return `/uploads-events/${fileName}`;
}
