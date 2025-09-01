"use server";

import fs from "fs";
import path from "path";

// ✅ Directory where event images are stored
const eventDir = path.join(process.cwd(), "public", "events");

// Ensure the folder exists
if (!fs.existsSync(eventDir)) {
  fs.mkdirSync(eventDir, { recursive: true });
}

export async function saveEventImage(file: File): Promise<string> {
  if (!file) throw new Error("No file provided");

  const ext = path.extname(file.name) || ".jpg"; // default jpg if missing

  // ✅ Determine next incremental filename
  const existingFiles = fs.readdirSync(eventDir).filter((f) => f.startsWith("e"));
  const numbers = existingFiles
    .map((f) => parseInt(f.replace(/\D/g, ""), 10))
    .filter((n) => !isNaN(n));

  const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  const fileName = `e${nextNumber}${ext}`;
  const filePath = path.join(eventDir, fileName);

  // Convert File → ArrayBuffer → Uint8Array
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  fs.writeFileSync(filePath, buffer);

  // ✅ Return relative path (for DB/frontend usage)
  return `/events/${fileName}`;
}