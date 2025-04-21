import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, Loader } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { getDeviceInfo } from "../utils/getDevice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, message, success, loading, otpPurpose } = useSelector(
    (state) => state.auth
  );
  // console.log(otpPurpose);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.username)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (error) {
      if (message.includes("Please verify your email before logging in")) {
        toast.info(message || "Please verify your email");
        navigate("/otp-verify", {
          state: {
            email: formData.username,
            message:
              "Please enter the OTP sent to your email to verify your account",
            otpPurpose: "verifyEmail",
          },
        });
      } else {
        toast.error(message || "An error occurred!");
      }
    }

    if (success) {
      // Check for device verification via otpPurpose
      if (otpPurpose === "verifyDevice") {
        toast.info(message || "Please verify your device");
        navigate("/otp-verify", {
          state: {
            email: formData.username,
            message: message,
            otpPurpose: otpPurpose,
          },
        });
      } else {
        // Regular login success - no OTP needed
        toast.success(message || "Login successful!");
        navigate("/");
      }
    }
  }, [error, success, message, navigate, formData.username, otpPurpose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = {
      ...formData,
      deviceInfo: getDeviceInfo(),
    };
    await dispatch(login(loginData));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.01]">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text mb-2">
            GupShup
          </h1>
          <p className="text-gray-600">Welcome back!</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-150 ease-in-out"
              placeholder="Email address"
              required
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-150 ease-in-out"
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                href="/forgot-password"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-all duration-150 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <a
              href="/register"
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Register here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
