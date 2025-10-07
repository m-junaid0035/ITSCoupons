"use server";

import fs from "fs";
import path from "path";

// ✅ Directory to store blog images
const blogDir = "/www/var/ITSCoupons-uploads/uploads-blogs";

// Ensure folder exists
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

export async function saveBlogImage(file: File): Promise<string> {
  if (!file) throw new Error("No file provided");

  // ✅ Use only the original filename (sanitize it)
  const fileName = file.name.replace(/\s+/g, "_");
  const filePath = path.join(blogDir, fileName);

  // ✅ Overwrite if it already exists
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Convert File → ArrayBuffer → Uint8Array
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  fs.writeFileSync(filePath, uint8Array);

  // ✅ Return clean public path
  return `/uploads-blogs/${fileName}`;
}
