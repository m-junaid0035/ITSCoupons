"use server";

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// ✅ Directory to store store images
const storeDir = "/www/var/ITSCoupons-uploads/uploads-stores";

// Ensure folder exists
if (!fs.existsSync(storeDir)) fs.mkdirSync(storeDir, { recursive: true });

export async function saveStoreImage(file: File): Promise<string> {
  if (!file) throw new Error("No file provided");

  const ext = path.extname(file.name) || ".png"; // default to png
  const fileName = `s-${uuidv4()}${ext}`; // UUID-based filename
  const filePath = path.join(storeDir, fileName);

  // Convert File → ArrayBuffer → Uint8Array
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  fs.writeFileSync(filePath, uint8Array);

  // Return relative path for frontend/DB
  return `/uploads-stores/${fileName}`;
}
