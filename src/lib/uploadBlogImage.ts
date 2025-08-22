"use server";

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// ✅ Directory to store blog images
const blogDir = "/root/ITSCoupons-uploads/blogs";

if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });

export async function saveBlogImage(file: File): Promise<string> {
  if (!file) throw new Error("No file provided");

  const ext = path.extname(file.name) || ".jpg";
  const fileName = `b-${uuidv4()}${ext}`;
  const filePath = path.join(blogDir, fileName);

  // Convert File → ArrayBuffer → Uint8Array
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer); // ✅ Correct type

  fs.writeFileSync(filePath, uint8Array);

  return `/blogs/${fileName}`;
}
