import { User } from "../models/user.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { sendToken } from "../utils/token.utils.js";
import sendMail from "../utils/email.helper.js";
import { generateOTP, createOTPEmailContent } from "../utils/generateOTP.js";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../utils/cloudinaryHelpers.js";
import { deleteFile } from "../utils/fileHelper.js";

export const create = asyncHandler(async (req, res, next) => {
  const { fullName, username, email, password, confirmPassword, deviceInfo } =
    req.body;
  //basic validations
  if (!fullName || !username || !email || !password || !confirmPassword) {
    return next(new AppError("All fields are required", 400));
  }
  if (password !== confirmPassword) {
    return next(new AppError("Passwords do not match", 400));
  }
  // Check for existing user
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    // If user exists but is unverified
    if (!existingUser.isVerified) {
      // If OTP is still valid (within 30 minutes)
      if (existingUser.otpExpires > new Date()) {
        return next(
          new AppError(
            "Please verify the OTP sent to your email. You can request a new OTP if needed.",
            403
          )
        );
      }

      // If OTP has expired, delete the old unverified user
      await User.findByIdAndDelete(existingUser._id);
    } else {
      // User exists and is verified - show normal duplicate errors
      if (existingUser.email === email) {
        return next(new AppError("Email already registered", 409));
      }
      if (existingUser.username === username) {
        return next(new AppError("Username already taken", 409));
      }
    }
  }

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 30 * 60 * 1000);
  const user = await User.create({
    fullName,
    username,
    email,
    password,
    otp,
    otpExpires,
    isVerified: false,
    trustedDevices: [],
  });

  try {
    const { subject, message } = createOTPEmailContent(otp, true);
    await sendMail({
      email: user.email,
      subject,
      message,
    });
  } catch (error) {
    console.log(error);
    await User.findByIdAndDelete(user._id);
    return next(
      new AppError("Failed to send verification email. Please try again.", 500)
    );
  }

  // Store device info to add after verification
  if (deviceInfo) {
    req.session = req.session || {};
    req.session.pendingDeviceRegistration = {
      userId: user._id,
      deviceInfo,
      timestamp: Date.now(),
    };
  }

  user.password = undefined;
  user.otp = undefined;
  res.status(201).json({
    success: true,
    message:
      "User created successfully. Please check your email for the verification OTP.",
    otpPurpose: "verifyEmail",
  });
});
export const verifyOTP = asyncHandler(async (req, res, next) => {
  const { email, otp, deviceInfo, otpPurpose } = req.body;

  if (!email || !otp) {
    return next(new AppError("Email and OTP are required", 400));
  }

  if (!otpPurpose) {
    return next(new AppError("OTP purpose is required", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Check if OTP is valid
  if (user.otp !== otp || user.otpExpires < new Date()) {
    return next(new AppError("Invalid or expired OTP", 400));
  }

  // Handle different OTP purposes
  switch (otpPurpose) {
    case "verifyEmail":
      // Verify both email and save device
      user.isVerified = true;

      // Handle device info for email verification
      if (deviceInfo && deviceInfo.deviceId) {
        if (typeof user.addTrustedDevice === "function") {
          user.addTrustedDevice(deviceInfo);
        } else {
          user.trustedDevices.push(deviceInfo);
        }
        console.log("Added device from request body:", deviceInfo);
      } else if (
        req.session &&
        req.session.pendingDeviceRegistration &&
        req.session.pendingDeviceRegistration.userId.toString() ===
          user._id.toString()
      ) {
        const sessionDeviceInfo =
          req.session.pendingDeviceRegistration.deviceInfo;
        if (typeof user.addTrustedDevice === "function") {
          user.addTrustedDevice(sessionDeviceInfo);
        } else {
          user.trustedDevices.push(sessionDeviceInfo);
        }
        delete req.session.pendingDeviceRegistration;
      } else {
      }
      break;

    case "verifyDevice":
      // Only verify device, email should already be verified
      if (!user.isVerified) {
        return next(
          new AppError("Email must be verified before adding device", 400)
        );
      }

      // Handle device info
      if (deviceInfo && deviceInfo.deviceId) {
        if (typeof user.addTrustedDevice === "function") {
          user.addTrustedDevice(deviceInfo);
        } else {
          user.trustedDevices.push(deviceInfo);
        }
      } else {
        return next(new AppError("Device information is required", 400));
      }
      break;

    case "forgotPassword":
    case "resetPassword":
      // These will be implemented later as mentioned
      return next(
        new AppError("This functionality is not implemented yet", 501)
      );

    default:
      return next(new AppError("Invalid OTP purpose", 400));
  }

  // Clear OTP data after successful verification
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save();

  sendToken(user, 200, res);
});
export const resendOtp = asyncHandler(async (req, res, next) => {
  const { email, otpPurpose } = req.body;

  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  if (!otpPurpose) {
    return next(new AppError("OTP purpose is required", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Different validation based on OTP purpose
  switch (otpPurpose) {
    case "verifyEmail":
      if (user.isVerified) {
        return next(new AppError("Email is already verified", 400));
      }
      break;

    case "verifyDevice":
      if (!user.isVerified) {
        return next(
          new AppError("Email must be verified before adding device", 400)
        );
      }
      break;

    case "forgotPassword":
    case "resetPassword":
      // No specific validation needed for password operations
      break;

    default:
      return next(new AppError("Invalid OTP purpose", 400));
  }

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 30 * 60 * 1000);
  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  try {
    // Customize the email content based on the OTP purpose
    let subject, message;

    switch (otpPurpose) {
      case "verifyEmail":
        ({ subject, message } = createOTPEmailContent(
          otp,
          false,
          "Email Verification"
        ));
        break;

      case "verifyDevice":
        ({ subject, message } = createOTPEmailContent(
          otp,
          false,
          "Device Verification"
        ));
        break;

      case "forgotPassword":
      case "resetPassword":
        ({ subject, message } = createOTPEmailContent(
          otp,
          false,
          "Password Reset"
        ));
        break;

      default:
        ({ subject, message } = createOTPEmailContent(otp, false));
    }

    await sendMail({
      email: user.email,
      subject,
      message,
    });

    res.status(200).json({
      status: "success",
      message: `New OTP for ${otpPurpose} sent successfully`,
      otpPurpose,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    return next(
      new AppError("Failed to send verification email. Please try again.", 500)
    );
  }
});
export const authenticate = asyncHandler(async (req, res, next) => {
  const { username, password, deviceInfo } = req.body;

  if (!username || !password) {
    return next(
      new AppError("username credentials and password are required", 400)
    );
  }

  if (
    !deviceInfo ||
    !deviceInfo.userAgent ||
    !deviceInfo.platform ||
    !deviceInfo.deviceId
  ) {
    return next(new AppError("Device information is required", 400));
  }

  const user = await User.findOne({
    $or: [{ email: username }, { username: username }],
  }).select("+password");
  if (!user) {
    return next(new AppError("Invalid credentials", 401));
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return next(new AppError("Invalid credentials", 401));
  }
  if (!user.isVerified) {
    return next(
      new AppError(
        "Your email is not verified. Please verify your email before logging in. We've sent a OTP to your email.",
        403
      )
    );
  }

  // Check if the device exists in trustedDevices array
  const deviceIndex = user.trustedDevices.findIndex(
    (d) => d.deviceId === deviceInfo.deviceId
  );

  const isTrustedDevice = deviceIndex >= 0;

  if (isTrustedDevice) {
    // Update last used time for the device
    user.trustedDevices[deviceIndex].lastUsed = Date.now();
    await user.save();

    user.password = undefined;
    sendToken(user, 200, res);
  } else {
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    try {
      const { subject, message } = createOTPEmailContent(otp, false, true);
      await sendMail({
        email: user.email,
        subject,
        message,
      });

      // Save temporary device info for later verification
      req.session = req.session || {};
      req.session.pendingDeviceVerification = {
        userId: user._id,
        deviceInfo,
        timestamp: Date.now(),
      };

      res.status(200).json({
        success: true,
        message:
          "We noticed a login attempt from a new device. Please verify with the OTP sent to your email.",
        email: user.email,
        otpPurpose: "verifyDevice",
      });
    } catch (error) {
      console.log(error);
      return next(
        new AppError(
          "Failed to send verification email. Please try again.",
          500
        )
      );
    }
  }
});
export const profile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select("-password");

  if (!user) {
    return next(new AppError("User not found", 401));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});
export const getSelectedUserProfile = asyncHandler(async (req, res, next) => {
  const { username } = req.params;
  if (!username) {
    return next(new AppError("Username is required", 400));
  }
  const user = await User.findOne({ username }).select("-password");

  // console.log(user);
  if (!user) {
    return next(new AppError("User not found", 401));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const update = asyncHandler(async (req, res, next) => {
  const { fullName, bio, phoneNumber, gender } = req.body;

  const userId = req.user.id;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const updateData = {};
  if (fullName) updateData.fullName = fullName;
  if (bio) updateData.bio = bio;
  if (phoneNumber) updateData.phoneNumber = phoneNumber;
  if (gender) updateData.gender = gender;

  if (Object.keys(updateData).length === 0) {
    return next(new AppError("No update data provided", 400));
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
    select:
      "-password -otp -otpExpires -resetPasswordOtp -resetPasswordOtpExpires",
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

/**
 * @desc    Logout user & clear cookie
 * @route   POST /api/users/logout
 * @access  Private
 */

export const uploadProfileImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Please provide Student Image!", 400));
  }
  // console.log(req.file);
  const userId = req.user.id;
  if (!userId) {
    return next(new AppError("Student ID is required", 400));
  }
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("Student not found", 404));
  }
  if (user.profilePictureUrl) {
    // Extract the public ID from the URL (Cloudinary URL format)
    const imagePublicId = user.profilePictureUrl.split("/").pop().split(".")[0];
    await deleteFileFromCloudinary(imagePublicId, "user_profiles");
  }
  const localImagePath = req.file.path;
  try {
    const cloudinaryUrl = await uploadFileToCloudinary(
      localImagePath,
      "user_profiles"
    );
    user.profilePictureUrl = cloudinaryUrl;
    await user.save({ validateBeforeSave: false });
    await deleteFile(localImagePath).catch((err) =>
      console.warn("Failed to delete local file:", err)
    );
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully!",
      profilePictureUrl: cloudinaryUrl,
    });
  } catch (error) {
    console.log(error);
    await deleteFile(localImagePath).catch(console.warn);
    return next(new AppError("Image upload failed", 500));
  }
});
export const logout = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("user not found", 404));
  }
  const options = {
    expires: new Date(Date.now()),
    httpOnly: true,
  };
  res.status(200).cookie("refreshtoken", options).json({
    success: true,
    message: "user logout successfully",
  });
});

export const getUserByQuery = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return next(new AppError("Authentication required", 401));
    }
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ error: "Search query is required" });
    }

    // Modified to search only by username and return full user data
    const users = await User.find({
      username: { $regex: q, $options: "i" },
    })
      // Removed the select() to return all user fields
      .limit(20);

    // console.log(users);
    return res.json(users);
  } catch (error) {
    console.error(error);
    return next(new AppError("Error searching users", 500));
  }
});
