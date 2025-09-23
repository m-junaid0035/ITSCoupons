"use server";

import fs from "fs";
import path from "path";

// ✅ Directories
const logoDir = path.join(process.cwd(), "public", "logos");
const faviconDir = path.join(process.cwd(), "public", "favicons");

// Ensure folders exist
[logoDir, faviconDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

export async function saveSettingLogo(file: File): Promise<string> {
  return saveImage(file, logoDir, "logo");
}

export async function saveSettingFavicon(file: File): Promise<string> {
  return saveImage(file, faviconDir, "favicon");
}

// ✅ Reusable helper
async function saveImage(file: File, targetDir: string, prefix: string): Promise<string> {
  if (!file) throw new Error("No file provided");

  const ext = path.extname(file.name) || ".jpg"; // default jpg
  const existingFiles = fs.readdirSync(targetDir).filter((f) => f.startsWith(prefix));

  const numbers = existingFiles
    .map((f) => parseInt(f.replace(/\D/g, ""), 10))
    .filter((n) => !isNaN(n));

  const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  const fileName = `${prefix}${nextNumber}${ext}`;
  const filePath = path.join(targetDir, fileName);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  fs.writeFileSync(filePath, buffer);

  // ✅ Return relative path for DB/frontend
  return `/${path.basename(targetDir)}/${fileName}`;
}