/**
 * @param {string} message - Error message describing the issue
 * @param {number} statusCode - HTTP status code associated with the error
 */

export default class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor); // For debugging
  }
}
