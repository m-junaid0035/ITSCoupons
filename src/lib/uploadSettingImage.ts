"use server";

import fs from "fs";
import path from "path";

/* ===============================
   Logo Upload
================================ */
const logoDir = "/www/var/ITSCoupons-uploads/uploads-logos";

// Ensure folder exists
if (!fs.existsSync(logoDir)) fs.mkdirSync(logoDir, { recursive: true });

export async function saveSettingLogo(file: File): Promise<string> {
  if (!file) throw new Error("No file provided");

  const originalName = file.name.replace(/\s+/g, "_"); // replace spaces with underscores
  const timestamp = Date.now();
  const fileName = `${timestamp}-${originalName}`;
  const filePath = path.join(logoDir, fileName);

  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  fs.writeFileSync(filePath, uint8Array);

  return `/uploads-logos/${fileName}`;
}

/* ===============================
   Favicon Upload
================================ */
const faviconDir = "/www/var/ITSCoupons-uploads/uploads-favicons";

// Ensure folder exists
if (!fs.existsSync(faviconDir)) fs.mkdirSync(faviconDir, { recursive: true });

export async function saveSettingFavicon(file: File): Promise<string> {
  if (!file) throw new Error("No file provided");

  const originalName = file.name.replace(/\s+/g, "_");
  const timestamp = Date.now();
  const fileName = `${timestamp}-${originalName}`;
  const filePath = path.join(faviconDir, fileName);

  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  fs.writeFileSync(filePath, uint8Array);

  return `/uploads-favicons/${fileName}`;
}
