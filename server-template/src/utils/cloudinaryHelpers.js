import fs from "fs";
import cloudinary from "../config/cloudinaryConfig.js";

export const uploadFileToCloudinary = async (localImagePath) => {
  try {
    if (!fs.existsSync(localImagePath)) {
      throw new Error(`File not found: ${localImagePath}`);
    }
    const result = await cloudinary.uploader.upload(localImagePath);
    return result.secure_url;
  } catch (error) {
    throw new Error("Error uploading to Cloudinary: " + error.message);
  }
};

export const deleteFileFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      throw new Error("Failed to delete file from Cloudinary");
    }
  } catch (error) {
    throw new Error("Error deleting from Cloudinary: " + error.message);
  }
};
