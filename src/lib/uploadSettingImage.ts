"use server";

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

/* ===============================
   Logo Upload
================================ */
const logoDir = "/www/var/ITSCoupons-uploads/uploads-logos";

// Ensure folder exists
if (!fs.existsSync(logoDir)) fs.mkdirSync(logoDir, { recursive: true });

export async function saveSettingLogo(file: File): Promise<string> {
  if (!file) throw new Error("No file provided");

  const ext = path.extname(file.name) || ".png"; // default to png
  const fileName = `l-${uuidv4()}${ext}`; // UUID-based filename
  const filePath = path.join(logoDir, fileName);

  // Convert File → ArrayBuffer → Uint8Array
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  fs.writeFileSync(filePath, uint8Array);

  // ✅ Return relative path
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

  const ext = path.extname(file.name) || ".ico"; // default to .ico
  const fileName = `f-${uuidv4()}${ext}`; // UUID-based filename
  const filePath = path.join(faviconDir, fileName);

  // Convert File → ArrayBuffer → Uint8Array
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  fs.writeFileSync(filePath, uint8Array);

  // ✅ Return relative path
  return `/uploads-favicons/${fileName}`;
}
