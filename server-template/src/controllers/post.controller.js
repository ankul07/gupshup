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

/* ======================== CREATE USER FUNCTION START ========================*/
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
  console.log(req.body);
  console.log(req.file);

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
    const uploadResult = await uploadFileToCloudinary(
      localImagePath,
      "posts",
      user.username
    );

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
}); /* ======================== CREATE USER FUNCTION END ========================*/

/* ======================== GET ALL POST FUNCTION START ========================*/
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
}); /* ======================== GET ALL POST FUNCTION END ========================*/

/* ======================== GET AUTHENTICATED USER POSTS FUNCTION START ========================*/
export const getSelectedUserPosts = asyncHandler(async (req, res, next) => {
  try {
    const { username } = req.params;
    const userId = req.user.id; // Current logged-in user ID (needed for checking likes, etc.)

    console.log(username);
    // Find the user by username instead of ID
    const targetUser = await User.findOne({ username }).select("_id posts");

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!targetUser.posts || targetUser.posts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No posts found",
        data: [],
      });
    }

    // Get the post IDs from targetUser.posts
    const postIds = targetUser.posts;

    // Find the posts
    const posts = await Post.find({ _id: { $in: postIds } })
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

    const transformedPosts = posts.map((post) => {
      const postObj = post.toObject();

      return {
        id: postObj._id,
        user: {
          id: postObj.user._id,
          username: postObj.user.username,
          profilePicture: postObj.user.profilePictureUrl,
          isVerified: postObj.user.isVerified || false,
          isFollowing: false,
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
      message: "User posts fetched successfully",
      data: transformedPosts,
    });
  } catch (error) {
    console.error("Error in getUserPosts:", error);
    next(new AppError("Failed to fetch user posts", 500));
  }
}); /* ======================== GET AUTHENTICATED USER POSTS FUNCTION END ========================*/

/* ======================== GET POST BY ID FUNCTION START ========================*/
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
}); /* ======================== GET POST BY ID FUNCTION END ========================*/

/* ======================== TOOGLE LIKE POST FUNCTION START ========================*/
export const likePost = asyncHandler(async (req, res, next) => {
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
    let post = await Post.findById(postId);
    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    // Check in both post.likes and user.likedPosts
    const isLikedInPost = post.likes.includes(userId);
    const isLikedInUser = user.likedPosts.includes(postId);

    // Determine if post is considered liked (if either is true, it's "liked" in some form)
    const isAlreadyLiked = isLikedInPost || isLikedInUser;

    if (isAlreadyLiked) {
      // Unlike the post - ensure both collections are updated
      await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
      await User.findByIdAndUpdate(userId, { $pull: { likedPosts: postId } });

      // Get updated post with populated fields
      post = await Post.findById(postId)
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

      // Get updated user to check saved status
      const updatedUser = await User.findById(userId).select("savedPosts");
      const isSaved = updatedUser.savedPosts?.includes(postId) || false;

      // Transform post data directly inside the function
      const postObj = post.toObject();
      const transformedPost = {
        id: postObj._id,
        user: {
          id: postObj.user._id,
          username: postObj.user.username,
          profilePicture: postObj.user.profilePictureUrl,
          isVerified: postObj.user.isVerified || false,
          isFollowing: false,
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
          isSavedByMe: isSaved,
          isReportedByMe: postObj.reportedBy.includes(userId),
          location: postObj.location,
          tags: postObj.hashtags.map((tag) => tag.replace("#", "")),
        },
      };

      res.status(200).json({
        success: true,
        message: "Post unliked successfully",
        isLiked: false,
        likesCount: post.likes.length,
        data: transformedPost,
      });
    } else {
      // Like the post
      await Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } });
      await User.findByIdAndUpdate(userId, {
        $addToSet: { likedPosts: postId },
      });

      // Get updated post with populated fields
      post = await Post.findById(postId)
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

      // Get updated user to check saved status
      const updatedUser = await User.findById(userId).select("savedPosts");
      const isSaved = updatedUser.savedPosts?.includes(postId) || false;

      // Transform post data directly inside the function
      const postObj = post.toObject();
      const transformedPost = {
        id: postObj._id,
        user: {
          id: postObj.user._id,
          username: postObj.user.username,
          profilePicture: postObj.user.profilePictureUrl,
          isVerified: postObj.user.isVerified || false,
          isFollowing: false,
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
          isSavedByMe: isSaved,
          isReportedByMe: postObj.reportedBy.includes(userId),
          location: postObj.location,
          tags: postObj.hashtags.map((tag) => tag.replace("#", "")),
        },
      };

      res.status(200).json({
        success: true,
        message: "Post liked successfully",
        isLiked: true,
        likesCount: post.likes.length,
        data: transformedPost,
      });
    }
  } catch (error) {
    console.error("Error liking/unliking post:", error);
    next(new AppError("Failed to like/unlike post", 500));
  }
}); /* ======================== TOOGLE LIKE POST FUNCTION END ========================*/

/* ======================== GET LIKED POST FUNCTION START ========================*/
export const getLikedPosts = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find the user and get their liked posts
    const user = await User.findById(userId).select("likedPosts");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.likedPosts || user.likedPosts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No liked posts found",
        data: [],
      });
    }

    // Get the liked post IDs
    const likedPostIds = user.likedPosts;

    // Find the posts
    const posts = await Post.find({ _id: { $in: likedPostIds } })
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

    const transformedPosts = posts.map((post) => {
      const postObj = post.toObject();

      return {
        id: postObj._id,
        user: {
          id: postObj.user._id,
          username: postObj.user.username,
          profilePicture: postObj.user.profilePictureUrl,
          isVerified: postObj.user.isVerified || false,
          isFollowing: false,
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
            isLikedByMe: true, // Since these are liked posts, this will always be true
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
          isSavedByMe: postObj.savedBy
            ? postObj.savedBy.includes(userId)
            : false,
          isReportedByMe: postObj.reportedBy
            ? postObj.reportedBy.includes(userId)
            : false,
          location: postObj.location,
          tags: postObj.hashtags.map((tag) => tag.replace("#", "")),
        },
      };
    });

    res.status(200).json({
      success: true,
      message: "Liked posts fetched successfully",
      data: transformedPosts,
    });
  } catch (error) {
    console.error("Error in getLikedPosts:", error);
    next(new AppError("Failed to fetch liked posts", 500));
  }
}); /* ======================== GET LIKED POST FUNCTION END ========================*/

/* ======================== TOGGLE SAVED POST  FUNCTION START ========================*/
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
    let post = await Post.findById(postId);
    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    const isAlreadySaved = user.savedPosts.includes(postId);
    if (isAlreadySaved) {
      await User.findByIdAndUpdate(userId, { $pull: { savedPosts: postId } });
      await Post.findByIdAndUpdate(postId, { $pull: { savedBy: userId } });

      // Get updated post with populated fields
      post = await Post.findById(postId)
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

      // Transform post data directly inside the function
      const postObj = post.toObject();
      const transformedPost = {
        id: postObj._id,
        user: {
          id: postObj.user._id,
          username: postObj.user.username,
          profilePicture: postObj.user.profilePictureUrl,
          isVerified: postObj.user.isVerified || false,
          isFollowing: false,
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
          isSavedByMe: false,
          isReportedByMe: postObj.reportedBy.includes(userId),
          location: postObj.location,
          tags: postObj.hashtags.map((tag) => tag.replace("#", "")),
        },
      };

      res.status(200).json({
        success: true,
        message: "Post unsaved successfully",
        isSaved: false,
        data: transformedPost,
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { savedPosts: postId },
      });
      await Post.findByIdAndUpdate(postId, { $addToSet: { savedBy: userId } });

      // Get updated post with populated fields
      post = await Post.findById(postId)
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

      // Transform post data directly inside the function
      const postObj = post.toObject();
      const transformedPost = {
        id: postObj._id,
        user: {
          id: postObj.user._id,
          username: postObj.user.username,
          profilePicture: postObj.user.profilePictureUrl,
          isVerified: postObj.user.isVerified || false,
          isFollowing: false,
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
          isSavedByMe: true,
          isReportedByMe: postObj.reportedBy.includes(userId),
          location: postObj.location,
          tags: postObj.hashtags.map((tag) => tag.replace("#", "")),
        },
      };

      res.status(200).json({
        success: true,
        message: "Post saved successfully",
        isSaved: true,
        data: transformedPost,
      });
    }
  } catch (error) {
    console.error("Error saving post:", error);
    next(new AppError("Failed to save post", 500));
  }
}); /* ======================== TOGGLE SAVED POST FUNCTION END ==========================*/

/* ======================== GET SAVED POST FUNCTION START ========================*/
export const getSavedPosts = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find the user and populate their saved posts
    const user = await User.findById(userId).select("savedPosts");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.savedPosts || user.savedPosts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No saved posts found",
        data: [],
      });
    }

    // Get the saved post IDs
    const savedPostIds = user.savedPosts;

    // Find the posts
    const posts = await Post.find({ _id: { $in: savedPostIds } })
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

    const transformedPosts = posts.map((post) => {
      const postObj = post.toObject();

      return {
        id: postObj._id,
        user: {
          id: postObj.user._id,
          username: postObj.user.username,
          profilePicture: postObj.user.profilePictureUrl,
          isVerified: postObj.user.isVerified || false,
          isFollowing: false,
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
          isSavedByMe: true, // Since these are saved posts, this will always be true
          isReportedByMe: postObj.reportedBy.includes(userId),
          location: postObj.location,
          tags: postObj.hashtags.map((tag) => tag.replace("#", "")),
        },
      };
    });

    res.status(200).json({
      success: true,
      message: "Saved posts fetched successfully",
      data: transformedPosts,
    });
  } catch (error) {
    console.error("Error in getSavedPosts:", error);
    next(new AppError("Failed to fetch saved posts", 500));
  }
}); /* ======================== GET SAVED POST FUNCTION END ========================*/
