import AppError from "../utils/AppError.js";

/**
 * @desc    Global error handling middleware
 * @param   {Object} err - Error object
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next function
 * @returns {Object} JSON response with error details
 */
const globalErrorHandler = (err, req, res, next) => {
  // Set default error status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  let error = { ...err };
  error.message = message;

  // Handle MongoDB CastError (Invalid ID format)
  if (err.name === "CastError") {
    error = new AppError(`Invalid ${err.path}: ${err.value}.`, 400);
  }

  // Handle MongoDB Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]; // Extract the field name causing the error
    const value = err.keyValue[field]; // Extract the duplicated value
    const message = value
      ? `Duplicate value '${value}' found for field '${field}'. Please use a different value.`
      : `Duplicate value found for field '${field}'. Please provide a valid value.`;

    error = new AppError(message, 400);
  }

  // Handle Invalid JWT (JSON Web Token) Error
  if (err.name === "JsonWebTokenError") {
    error = new AppError("Invalid token. Please log in again.", 401);
  }

  // Handle Expired JWT Error
  if (err.name === "TokenExpiredError") {
    error = new AppError("Your token has expired. Please log in again.", 401);
  }

  // Handle Unauthorized User Error
  if (err.name === "UserNotAuthorized") {
    error = new AppError("You are not authorized to perform this action.", 403);
  }

  // Send error response
  res.status(error.statusCode || statusCode).json({
    success: false,
    message: error.message || message,
    error,
  });
};

export default globalErrorHandler;
