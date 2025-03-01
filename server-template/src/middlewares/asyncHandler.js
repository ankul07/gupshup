/**
 * @desc    Middleware to handle asynchronous route errors
 * @param   {Function} theFunc - The async route handler function
 * @returns {Function} A function that catches and forwards errors to Express error handling middleware
 */

const asyncHandler = (theFunc) => (req, res, next) =>
  Promise.resolve(theFunc(req, res, next)).catch(next);

export default asyncHandler;
