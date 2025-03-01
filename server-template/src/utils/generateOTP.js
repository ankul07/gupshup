import crypto from "crypto";

export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const createOTPEmailContent = (otp, isNewUser = true) => {
  return {
    subject: isNewUser
      ? "Welcome! Verify Your Email"
      : "New OTP for Email Verification",
    message: `Your verification OTP is: ${otp}\n\nThis OTP will expire in 30 minutes.\nPlease do not share this OTP with anyone.`,
  };
};
