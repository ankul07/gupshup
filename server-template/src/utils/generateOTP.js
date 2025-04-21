import crypto from "crypto";

export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const createOTPEmailContent = (
  otp,
  isNewUser = true,
  isDeviceVerification = false
) => {
  let subject, message;

  if (isDeviceVerification) {
    subject = "Device Verification Required";
    message = `
      <h1>Device Verification</h1>
      <p>We noticed a login attempt from a new device. For your security, please verify this device with the following OTP:</p>
      <h2>${otp}</h2>
      <p>This OTP will expire in 15 minutes.</p>
      <p>If you did not attempt to login, please change your password immediately.</p>
    `;
  } else if (isNewUser) {
    subject = "Welcome! Please Verify Your Email";
    message = `
      <h1>Welcome to Our Platform!</h1>
      <p>Thank you for registering. Please verify your email with the following OTP:</p>
      <h2>${otp}</h2>
      <p>This OTP will expire in 30 minutes.</p>
    `;
  } else {
    subject = "Your New Verification OTP";
    message = `
      <h1>Email Verification</h1>
      <p>As requested, here's your new verification OTP:</p>
      <h2>${otp}</h2>
      <p>This OTP will expire in 30 minutes.</p>
    `;
  }

  return { subject, message };
};
