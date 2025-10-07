"use server";

import fs from "fs";
import path from "path";

/* ===============================
   Logo Upload
================================ */
const logoDir = "/www/var/ITSCoupons-uploads/uploads-logos";

// Ensure folder exists
if (!fs.existsSync(logoDir)) {
  fs.mkdirSync(logoDir, { recursive: true });
}

export async function saveSettingLogo(file: File): Promise<string> {
  if (!file) throw new Error("No file provided");

  // ✅ Use only original filename (sanitize)
  const fileName = file.name.replace(/\s+/g, "_");
  const filePath = path.join(logoDir, fileName);

  // ✅ Overwrite if file already exists
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Convert File → ArrayBuffer → Uint8Array
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  fs.writeFileSync(filePath, uint8Array);

  // ✅ Return clean public path
  return `/uploads-logos/${fileName}`;
}

/* ===============================
   Favicon Upload
================================ */
const faviconDir = "/www/var/ITSCoupons-uploads/uploads-favicons";

// Ensure folder exists
if (!fs.existsSync(faviconDir)) {
  fs.mkdirSync(faviconDir, { recursive: true });
}

export async function saveSettingFavicon(file: File): Promise<string> {
  if (!file) throw new Error("No file provided");

  // ✅ Use only original filename (sanitize)
  const fileName = file.name.replace(/\s+/g, "_");
  const filePath = path.join(faviconDir, fileName);

  // ✅ Overwrite if file already exists
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  fs.writeFileSync(filePath, uint8Array);

  // ✅ Return clean public path
  return `/uploads-favicons/${fileName}`;
}
