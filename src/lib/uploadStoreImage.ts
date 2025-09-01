"use server";

import fs from "fs";
import path from "path";

// ✅ Directory where images are stored
const storeDir = path.join(process.cwd(), "public", "stores");

// Ensure the folder exists
if (!fs.existsSync(storeDir)) {
  fs.mkdirSync(storeDir, { recursive: true });
}

export async function saveStoreImage(file: File): Promise<string> {
  if (!file) throw new Error("No file provided");

  const ext = path.extname(file.name) || ".png";

  // ✅ Determine next incremental filename
  const existingFiles = fs.readdirSync(storeDir).filter((f) => f.startsWith("s"));
  const numbers = existingFiles
    .map((f) => parseInt(f.replace(/\D/g, ""), 10))
    .filter((n) => !isNaN(n));

  const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  const fileName = `s${nextNumber}${ext}`;
  const filePath = path.join(storeDir, fileName);

  // Convert File → ArrayBuffer → Uint8Array
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  fs.writeFileSync(filePath, buffer);

  // ✅ Return relative path (for DB/frontend usage)
  return `/stores/${fileName}`;
}