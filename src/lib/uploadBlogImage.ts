"use server";

import fs from "fs";
import path from "path";

// ✅ Directory where blog images will be stored
const blogDir = path.join(process.cwd(), "public", "blogs");

// Ensure the folder exists
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

export async function saveBlogImage(file: File): Promise<string> {
  if (!file) throw new Error("No file provided");

  const ext = path.extname(file.name) || ".jpg"; // default to jpg if missing

  // ✅ Determine next incremental filename (b1, b2, b3…)
  const existingFiles = fs.readdirSync(blogDir).filter((f) => f.startsWith("b"));
  const numbers = existingFiles
    .map((f) => parseInt(f.replace(/\D/g, ""), 10))
    .filter((n) => !isNaN(n));

  const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  const fileName = `b${nextNumber}${ext}`;
  const filePath = path.join(blogDir, fileName);

  // Convert File → ArrayBuffer → Uint8Array
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  fs.writeFileSync(filePath, buffer);

  // ✅ Return relative path for DB/frontend
  return `/blogs/${fileName}`;
}
