import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import {
  verifyOTP,
  resendOTP,
  clearError,
  clearSuccess,
} from "../redux/auth/authSlice";
import { getDeviceInfo } from "../utils/getDevice";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds countdown
  const [deviceInfo, setDeviceInfo] = useState({
    deviceId: "",
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    lastUsed: new Date(),
    isActive: true,
  });
  // States for dynamic UI text based on OTP purpose
  const [titleText, setTitleText] = useState("Enter verification code");
  const [descriptionText, setDescriptionText] = useState("");
  const [buttonText, setButtonText] = useState("Verify OTP");

  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, success, message, loading } = useSelector(
    (state) => state.auth
  );

  const email = location.state?.email || null;
  const otpPurpose = location.state?.otpPurpose || null;
  const locationMessage = location.state?.message || null;
  console.log("otpPurpose", otpPurpose);
  console.log("email", email);
  console.log("location message", locationMessage);

  // Initialize device info
  useEffect(() => {
    setDeviceInfo(getDeviceInfo());
  }, []);

  // Set the UI text based on the OTP purpose
  useEffect(() => {
    // Set default description with email
    setDescriptionText(`We've sent a code to ${email}`);

    // Handle the different OTP purposes
    switch (otpPurpose) {
      case "verifyEmail":
        setTitleText("Email Verification");
        setDescriptionText(
          `Please enter the code sent to ${email} to verify your email address`
        );
        setButtonText("Verify Email");
        break;
      case "verifyDevice":
        setTitleText("Device Verification");
        setDescriptionText(
          `For your security, please enter the code sent to ${email} to verify this device`
        );
        setButtonText("Verify Device");
        break;
      case "forgotPassword":
        setTitleText("Password Recovery");
        setDescriptionText(
          `Enter the code sent to ${email} to proceed with password reset`
        );
        setButtonText("Verify Code");
        break;
      case "resetPassword":
        setTitleText("Reset Password");
        setDescriptionText(
          `Enter the verification code sent to ${email} to reset your password`
        );
        setButtonText("Continue");
        break;
      default:
        // Use default text or location message if provided
        if (locationMessage) {
          setTitleText("Verification Required");
          setDescriptionText(locationMessage);
        }
        break;
    }
  }, [otpPurpose, email, locationMessage]);

  // Redirect if no email is provided
  useEffect(() => {
    if (!email) {
      navigate("/register");
      toast.error("Please register first");
    }
  }, [email, navigate]);

  // Handle countdown timer for resend button
  useEffect(() => {
    if (timeLeft === 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  // Handle API responses
  useEffect(() => {
    if (error) {
      toast.error(message || "Verification failed");
      // dispatch(clearError());
    }

    if (success) {
      toast.success(message || "Email verified successfully");
      // dispatch(clearSuccess());

      // Handle redirect based on OTP purpose
      if (otpPurpose === "resetPassword") {
        navigate("/reset-password", { state: { email, verified: true } });
      } else if (otpPurpose === "forgotPassword") {
        navigate("/reset-password", { state: { email, verified: true } });
      } else {
        navigate("/"); // Default redirect for email/device verification
      }
    }
  }, [error, success, message, dispatch, navigate, otpPurpose, email]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const otpArray = pastedData.split("").slice(0, 6);
    setOtp([...otpArray, ...Array(6 - otpArray.length).fill("")]);

    // Focus the next empty input or the last input
    const nextEmptyIndex = otpArray.length < 6 ? otpArray.length : 5;
    inputRefs.current[nextEmptyIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    // Make sure deviceInfo is available before proceeding
    if (!deviceInfo) {
      toast.error("Device information unavailable. Please try again.");
      return;
    }

    // Update lastUsed timestamp before sending
    const updatedDeviceInfo = {
      ...deviceInfo,
      lastUsed: new Date(),
    };

    await dispatch(
      verifyOTP({
        email,
        otp: otpString,
        deviceInfo: updatedDeviceInfo,
        otpPurpose: otpPurpose, // Pass the purpose to the backend
      })
    );
  };

  const handleResendOTP = async () => {
    if (timeLeft > 0) return;

    setIsResending(true);
    try {
      if (!deviceInfo) {
        toast.error("Device information unavailable. Please try again.");
        setIsResending(false);
        return;
      }
      const updatedDeviceInfo = {
        ...deviceInfo,
        lastUsed: new Date(),
      };
      await dispatch(
        resendOTP({
          email,
          deviceInfo: updatedDeviceInfo,
          otpPurpose: otpPurpose, // Pass the purpose for resending OTP
        })
      );
      setTimeLeft(30);
      setOtp(["", "", "", "", "", ""]);
      dispatch(clearSuccess());
      toast.success("New OTP sent successfully");
    } catch (error) {
      toast.error("Failed to resend OTP");
      dispatch(clearError());
    }
    setIsResending(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.01]">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text mb-2">
            GupShup
          </h1>
          <p className="text-gray-600">{titleText}</p>
          <p className="text-sm text-gray-500 mt-2">{descriptionText}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="flex justify-center space-x-4" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-150 ease-in-out"
                disabled={loading}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join("").length !== 6}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-all duration-150 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="animate-spin mr-2" size={18} />
                Verifying...
              </>
            ) : (
              buttonText
            )}
          </button>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={timeLeft > 0 || isResending}
                className="text-purple-600 hover:text-purple-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {timeLeft > 0
                  ? `Resend in ${timeLeft}s`
                  : isResending
                  ? "Sending..."
                  : "Resend"}
              </button>
            </p>
            <button
              type="button"
              onClick={() => {
                // Redirect based on OTP purpose
                if (
                  otpPurpose === "forgotPassword" ||
                  otpPurpose === "resetPassword"
                ) {
                  navigate("/forgot-password");
                } else if (otpPurpose === "verifyEmail") {
                  navigate("/register");
                } else {
                  navigate("/login");
                }
              }}
              className="text-sm font-medium text-purple-600 hover:text-purple-500"
            >
              {otpPurpose === "forgotPassword" || otpPurpose === "resetPassword"
                ? "Change email address"
                : otpPurpose === "verifyEmail"
                ? "Back to registration"
                : "Back to login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
