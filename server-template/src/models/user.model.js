import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

/**
 * @desc    User Schema defining structure and validation for user data
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minLength: [3, "Username must be at least 3 characters long"],
      maxLength: [30, "Username cannot exceed 30 characters"],
      index: true, // Improves query performance
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters long"],
      select: false, // Excludes password from query results by default
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    bio: {
      type: String,
      maxLength: [150, "Bio cannot exceed 150 characters"],
      default: "",
    },
    profilePictureUrl: {
      type: String,
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: function (v) {
          return validator.isMobilePhone(v);
        },
        message: "Please provide a valid phone number",
      },
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer not to say"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    resetPasswordOtp: {
      type: String,
      default: null,
    },
    resetPasswordOtpExpires: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    trustedDevices: [
      {
        deviceId: {
          type: String,
          required: true,
        },
        userAgent: String,
        platform: String,
        lastUsed: {
          type: Date,
          default: Date.now,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

/**
 * @desc    Middleware to hash the password before saving the user document
 */
userSchema.pre("save", async function (next) {
  // Hash password only if it's modified
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * @desc    Generates an access token for the user
 * @returns {String} JWT access token
 */
userSchema.methods.getAccessToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    }
  );
};

/**
 * @desc    Generates a refresh token for the user
 * @returns {String} JWT refresh token
 */
userSchema.methods.getRefreshToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    }
  );
};

/**
 * @desc    Compares the provided password with the stored hashed password
 * @param   {String} password - Plain text password
 * @returns {Boolean} True if passwords match, otherwise false
 */
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
