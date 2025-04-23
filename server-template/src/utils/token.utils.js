/**
 * Generates and sends an access token and refresh token to the client.
 *
 * @param {Object} user - The authenticated user object
 * @param {number} statusCode - HTTP status code for the response
 * @param {Object} res - Express response object
 */
export const sendToken = (user, statusCode, res) => {
  // Generate JWT access and refresh tokens
  const accessToken = user.getAccessToken();
  const refreshToken = user.getRefreshToken();

  // Cookie options for storing the refresh token
  const refreshTokenOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: true, // Set to `true` in production (ensures cookies are sent over HTTPS)
    sameSite: "none", // Allows requests from the same site; change to 'none' for cross-site cookies in production
  };

  // Send response with tokens and user data
  res
    .status(statusCode)
    .cookie("refreshtoken", refreshToken, refreshTokenOptions) // Set refresh token in HTTP-only cookie
    .json({
      success: true,
      message: "User Login Successfully",
      data: user, // Send user data (consider omitting sensitive fields)
      accessToken, // Send access token in response
    });
};
