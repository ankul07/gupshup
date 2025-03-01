import fs from "fs";
import path from "path";

export const saveImageLocally = async (imageBuffer, imagePath) => {
  try {
    await fs.promises.writeFile(imagePath, imageBuffer);
  } catch (error) {
    throw new Error("Error saving image locally: " + error.message);
  }
};
export const deleteFile = async (filePath) => {
  try {
    // Check if file exists using fs.promises.access

    await fs.promises.access(filePath); // Use promises.access instead of fs.access
    // Delete file if it exists
    await fs.promises.unlink(filePath);
  } catch (error) {
    throw new Error("Error saving image locally: " + error.message);
  }
};
