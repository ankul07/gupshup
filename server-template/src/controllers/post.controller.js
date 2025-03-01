import { User } from "../models/user.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import AppError from "../utils/AppError.js";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../utils/cloudinaryHelpers.js";
import { deleteFile } from "../utils/fileHelper.js";
import path from "path";
import { Post } from "../models/post.modal.js";

export const createPost = asyncHandler(async (req, res, next) => {
  // Check if image file is provided
  if (!req.file) {
    return next(new AppError("Please provide an image for the post", 400));
  }

  // Get authenticated user ID
  const userId = req.user.id;
  if (!userId) {
    return next(new AppError("Authentication required", 401));
  }

  // Verify user exists
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Get optional fields from request body
  const { caption, location } = req.body;

  // Parse hashtags from JSON string
  let hashtags = [];
  if (req.body.hashtags) {
    try {
      hashtags = JSON.parse(req.body.hashtags);
    } catch (error) {
      return next(new AppError("Invalid hashtags format", 400));
    }
  }
  // console.log(hashtags);

  // Get local image path from multer
  const localImagePath = req.file.path;

  try {
    // Upload image to Cloudinary
    const uploadResult = await uploadFileToCloudinary(localImagePath, "posts");

    // Create new post with uploaded image URL
    const newPost = await Post.create({
      user: userId,
      caption,
      location,
      hashtags,
      media: {
        imageUrl: uploadResult,
        videoUrl: null,
      },
    });

    // Add post to user's posts array
    await User.findByIdAndUpdate(userId, { $push: { posts: newPost._id } });

    // Populate user details for response
    await newPost.populate({
      path: "user",
      select: "username fullName profilePictureUrl isVerified",
    });

    // Clean up temporary file
    await deleteFile(localImagePath).catch((err) =>
      console.warn("Failed to delete local file:", err)
    );

    // Return success response
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: {
        post: newPost,
      },
    });
  } catch (error) {
    // Clean up temporary file if there was an error
    await deleteFile(localImagePath).catch(console.warn);
    return next(new AppError("Post creation failed", 500));
  }
});

export const getAllPost = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find all posts and populate user references
    const posts = await Post.find()
      .populate({
        path: "user",
        select: "username profilePictureUrl isVerified",
      })
      .populate({
        path: "comments.user",
        select: "username profilePictureUrl",
      })
      .populate({
        path: "likes",
        select: "username profilePictureUrl",
      })
      .populate({
        path: "shares",
        select: "username profilePictureUrl",
      })
      .sort("-createdAt");

    // Transform posts to match frontend structure
    const transformedPosts = posts.map((post) => {
      const postObj = post.toObject();

      return {
        id: postObj._id,
        user: {
          id: postObj.user._id,
          username: postObj.user.username,
          profilePicture: postObj.user.profilePictureUrl,
          isVerified: postObj.user.isVerified || false,
          isFollowing: false, // You would need to check this separately
        },
        content: {
          text: postObj.caption,
          imageUrl: postObj.media.imageUrl,
          videoUrl: postObj.media.videoUrl,
          createdAt: postObj.createdAt,
        },
        engagement: {
          likes: {
            count: postObj.likesCount,
            isLikedByMe: postObj.likes.some(
              (likeUser) => likeUser._id.toString() === userId
            ),
            topLikedBy: postObj.likes
              .slice(0, 2)
              .map((user) => user._id.toString()),
          },
          comments: {
            count: postObj.commentsCount,
            preview: postObj.comments.slice(0, 2).map((comment) => ({
              id: comment._id,
              user: {
                id: comment.user._id,
                username: comment.user.username,
                profilePicture: comment.user.profilePictureUrl,
              },
              text: comment.text,
              timestamp: comment.createdAt,
              isLikedByMe: comment.likes.includes(userId),
              likesCount: comment.likes.length,
            })),
          },
          shares: {
            count: postObj.sharesCount,
            isSharedByMe: postObj.shares.some(
              (shareUser) => shareUser._id.toString() === userId
            ),
          },
        },
        metadata: {
          isSavedByMe: postObj.savedBy.includes(userId),
          isReportedByMe: postObj.reportedBy.includes(userId),
          location: postObj.location,
          tags: postObj.hashtags.map((tag) => tag.replace("#", "")),
        },
      };
    });

    res.status(200).json({
      success: true,
      message: "Posts Fetched Successfully",
      data: transformedPosts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    next(new AppError("Failed to fetch posts", 500));
  }
});
export const savedPost = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return next(new AppError("Authentication required", 401));
    }

    // Get post ID from params
    const { postId } = req.params;
    if (!postId) {
      return next(new AppError("Post ID is required", 400));
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    const isAlreadySaved = user.savedPosts.includes(postId);
    if (isAlreadySaved) {
      await User.findByIdAndUpdate(userId, { $pull: { savedPosts: postId } });
      await Post.findByIdAndUpdate(postId, { $pull: { savedBy: userId } });
      res.status(200).json({
        success: true,
        message: "Post unsaved successfully",
        isSaved: false,
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { savedPosts: postId },
      });
      await Post.findByIdAndUpdate(postId, { $addToSet: { savedBy: userId } });
      res.status(200).json({
        success: true,
        message: "Post saved successfully",
        isSaved: true,
      });
    }
  } catch (error) {
    console.error("Error saving post:", error);
    next(new AppError("Failed to save post", 500));
  }
});
export const getPostById = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params; // Corrected to properly extract postId

    if (!userId) {
      return next(new AppError("Authentication required", 401));
    }

    if (!postId) {
      return next(new AppError("Post ID is required", 400));
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Find the post with populated fields (similar to getAllPost)
    const post = await Post.findById(postId)
      .populate({
        path: "user",
        select: "username profilePictureUrl isVerified",
      })
      .populate({
        path: "comments.user",
        select: "username profilePictureUrl",
      })
      .populate({
        path: "likes",
        select: "username profilePictureUrl",
      })
      .populate({
        path: "shares",
        select: "username profilePictureUrl",
      });

    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    const postObj = post.toObject();

    const transformedPost = {
      id: postObj._id,
      user: {
        id: postObj.user._id,
        username: postObj.user.username,
        profilePicture: postObj.user.profilePictureUrl,
        isVerified: postObj.user.isVerified || false,
        isFollowing: false, // You would need to check this separately
      },
      content: {
        text: postObj.caption,
        imageUrl: postObj.media.imageUrl,
        videoUrl: postObj.media.videoUrl,
        createdAt: postObj.createdAt,
      },
      engagement: {
        likes: {
          count: postObj.likesCount,
          isLikedByMe: postObj.likes.some(
            (likeUser) => likeUser._id.toString() === userId
          ),
          topLikedBy: postObj.likes
            .slice(0, 2)
            .map((user) => user._id.toString()),
        },
        comments: {
          count: postObj.commentsCount,
          preview: postObj.comments.slice(0, 2).map((comment) => ({
            id: comment._id,
            user: {
              id: comment.user._id,
              username: comment.user.username,
              profilePicture: comment.user.profilePictureUrl,
            },
            text: comment.text,
            timestamp: comment.createdAt,
            isLikedByMe: comment.likes.includes(userId),
            likesCount: comment.likes.length,
          })),
        },
        shares: {
          count: postObj.sharesCount,
          isSharedByMe: postObj.shares.some(
            (shareUser) => shareUser._id.toString() === userId
          ),
        },
      },
      metadata: {
        isSavedByMe: postObj.savedBy.includes(userId),
        isReportedByMe: postObj.reportedBy.includes(userId),
        location: postObj.location,
        tags: postObj.hashtags.map((tag) => tag.replace("#", "")),
      },
    };

    res.status(200).json({
      success: true,
      message: "Post Fetched Successfully",
      data: transformedPost,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    next(new AppError("Failed to fetch post", 500));
  }
});
