import { User } from "../models/user.model.js";
import { Post } from "../models/post.modal.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const getAllUser = asyncHandler(async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      message: "all user fetch successfully",
      data: users,
    });
  } catch (error) {
    console.log(error);
  }
});

export const getAllPosts = asyncHandler(async (req, res, next) => {
  try {
    const posts = await Post.find().populate({
      path: "user",
      select: "username",
    });
    res.status(200).json({
      success: true,
      message: "all post fetch successfully",
      data: posts,
    });
  } catch (error) {
    console.log(error);
  }
});

export const deletePostByAdmin = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }

  // Delete post
  await Post.findByIdAndDelete(postId);

  // Clean from users
  await User.updateMany(
    {
      $or: [{ savedPosts: postId }, { likedPosts: postId }, { posts: postId }],
    },
    {
      $pull: {
        savedPosts: postId,
        likedPosts: postId,
        posts: postId,
      },
    }
  );

  // Fetch updated posts
  const updatedPosts = await Post.find().sort({ createdAt: -1 }); // Optional: sort by date

  res.status(200).json({
    message: "Post deleted successfully",
    data: updatedPosts,
  });
});
