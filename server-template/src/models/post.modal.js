import mongoose from "mongoose";

/**
 * @desc    Post Schema defining structure and validation for post data
 */
const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Post must belong to a user"],
    },
    caption: {
      type: String,
      trim: true,
      maxLength: [2200, "Caption cannot exceed 2200 characters"],
    },
    media: {
      imageUrl: {
        type: String,
      },
      videoUrl: {
        type: String,
      },
    },
    location: {
      type: String,
      trim: true,
    },
    hashtags: {
      type: [String],
      default: [],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    shares: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reportedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

/**
 * @desc    Add indexes to improve query performance
 */
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ hashtags: 1 });

/**
 * @desc    Virtual property to get like count
 */
postSchema.virtual("likesCount").get(function () {
  return this.likes.length;
});

/**
 * @desc    Virtual property to get comment count
 */
postSchema.virtual("commentsCount").get(function () {
  return this.comments.length;
});

/**
 * @desc    Virtual property to get share count
 */
postSchema.virtual("sharesCount").get(function () {
  return this.shares.length;
});

/**
 * @desc    Middleware to handle cascading deletes
 *          When a post is deleted, remove its reference from the User model
 */
postSchema.pre("remove", async function (next) {
  try {
    // Import User model here to avoid circular dependency
    const User = mongoose.model("User");

    // Remove post reference from user's posts array
    await User.findByIdAndUpdate(this.user, {
      $pull: { posts: this._id },
    });

    // Remove post from all users' savedPosts arrays
    await User.updateMany(
      { savedPosts: this._id },
      { $pull: { savedPosts: this._id } }
    );

    next();
  } catch (err) {
    next(err);
  }
});

// Set toJSON and toObject options to include virtuals
postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });

export const Post = mongoose.model("Post", postSchema);
