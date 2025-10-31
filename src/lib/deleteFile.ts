"use server";

import fs from "fs";
import path from "path";

/**
 * Deletes a file from the server upload directory.
 * @param publicPath The public path returned earlier (e.g., `/uploads-blogs/image.jpg`)
 * @returns true if deleted successfully, false otherwise
 */
export async function deleteUploadedFile(publicPath: string): Promise<boolean> {
  try {
    if (!publicPath) return false;

    // Convert public path → absolute server path
    const absolutePath = path.join("/www/var/ITSCoupons-uploads", publicPath.replace(/^\/+/, ""));

    // Check if file exists
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log(`🗑️ Deleted file: ${absolutePath}`);
      return true;
    } else {
      console.warn(`⚠️ File not found: ${absolutePath}`);
      return false;
    }
  } catch (error) {
    console.error("❌ Error deleting file:", error);
    return false;
  }
}
