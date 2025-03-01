import asyncHandler from "./asyncHandler.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

/**
 * @desc    Middleware to check if the user is authenticated
 * @route   Protected routes middleware
 * @access  Private
 */
export const isAuthenticated = asyncHandler(async (req, res, next) => {
  // Get token from the Authorization header
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  // If no access token is provided, return an error
  if (!accessToken) {
    return next(new AppError("Access Token Required", 401));
  }

  try {
    // Verify the access token
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET
    );

    // Attach decoded user data to the request object
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Access Token Expired", 401));
    }
    return next(new AppError("Invalid Access Token", 401));
  }
});

/**
 * @desc    Refresh access token using refresh token
 * @route   POST /api/auth/refresh-token
 * @access  Private
 */
export const refreshToken = asyncHandler(async (req, res, next) => {
  try {
    // Get refresh token from cookies
    const refreshToken = req.cookies.refreshtoken;

    // If no refresh token is found, user needs to log in again
    if (!refreshToken) {
      return next(new AppError("Please login again", 401));
    }
    // console.log(refreshToken);
    // Verify refresh token
    const decoded = await jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );

    // Find user in the database
    const user = await User.findById(decoded.id);

    // If user no longer exists, return an error
    if (!user) {
      return next(new AppError("User no longer exists", 401));
    }

    // Generate a new access token
    const accessToken = user.getAccessToken();

    // Send the new access token in response
    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      accessToken,
    });
  } catch (error) {
    // Handle specific JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Invalid refresh token", 401));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError("Refresh token has expired", 401));
    }

    // Handle other errors
    return next(new AppError("Token refresh failed", 500));
  }
});
