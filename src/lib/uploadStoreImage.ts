"use server";

import fs from "fs";
import path from "path";

/* ===============================
   Store Image Upload
================================ */
const storeDir = "/www/var/ITSCoupons-uploads/uploads-stores";

// Ensure folder exists
if (!fs.existsSync(storeDir)) fs.mkdirSync(storeDir, { recursive: true });

export async function saveStoreImage(file: File): Promise<string> {
  if (!file) throw new Error("No file provided");

  const originalName = file.name.replace(/\s+/g, "_"); // replace spaces with underscores
  const timestamp = Date.now();
  const fileName = `${timestamp}-${originalName}`;
  const filePath = path.join(storeDir, fileName);

  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  fs.writeFileSync(filePath, uint8Array);

  // Return relative path for frontend/DB
  return `/uploads-stores/${fileName}`;
}
