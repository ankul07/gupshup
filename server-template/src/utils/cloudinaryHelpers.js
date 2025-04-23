import fs from "fs";
import cloudinary from "../config/cloudinaryConfig.js";

export const uploadFileToCloudinary = async (
  localImagePath,
  folderName,
  username,
  fileType = "profile"
) => {
  try {
    if (!fs.existsSync(localImagePath)) {
      throw new Error(`File not found: ${localImagePath}`);
    }

    let folder;
    let publicId;

    if (folderName === "user_profiles") {
      // For profile images
      folder = `user/${username}/profileimage`;
      publicId = "profile";
    } else if (folderName === "posts") {
      // For post images
      folder = `user/${username}/post`;
      publicId = `post_${Date.now()}`; // Unique name for each post image
    }

    const result = await cloudinary.uploader.upload(localImagePath, {
      folder: folder,
      public_id: publicId,
      overwrite: true,
      invalidate: true,
    });

    return result.secure_url;
  } catch (error) {
    throw new Error("Error uploading to Cloudinary: " + error.message);
  }
};

export const deleteFileFromCloudinary = async (
  publicId,
  folderName,
  username,
  imageType = "profile"
) => {
  try {
    let fullPublicId;

    if (folderName === "user_profiles") {
      // For profile images
      fullPublicId = `user/${username}/profileimage/profile`;
    } else if (folderName === "posts") {
      // For post images - requires the original publicId from the URL
      if (!publicId) {
        throw new Error("Public ID is required for deleting post images");
      }
      // Extract just the filename part without extension
      const postId = publicId.split("/").pop().split(".")[0];
      fullPublicId = `user/${username}/post/${postId}`;
    } else {
      // Fallback for generic file deletion
      fullPublicId = publicId;
    }

    const result = await cloudinary.uploader.destroy(fullPublicId);

    if (result.result !== "ok") {
      throw new Error("Failed to delete file from Cloudinary");
    }
  } catch (error) {
    throw new Error("Error deleting from Cloudinary: " + error.message);
  }
};
