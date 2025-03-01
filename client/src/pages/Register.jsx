import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { register, clearError, clearSuccess } from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, message, success } = useSelector((state) => state.auth);
  // console.log(message);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // Full Name validation
    if (formData.fullName.length < 3) {
      toast.error("Full name must be at least 3 characters long");
      return false;
    }

    // Username validation
    if (formData.username.length < 4) {
      toast.error("Username must be at least 4 characters long");
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      toast.error("Username can only contain letters, numbers and underscore");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Password validation
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }

    if (!/(?=.*[a-z])/.test(formData.password)) {
      toast.error("Password must contain at least one lowercase letter");
      return false;
    }

    if (!/(?=.*[A-Z])/.test(formData.password)) {
      toast.error("Password must contain at least one uppercase letter");
      return false;
    }

    if (!/(?=.*\d)/.test(formData.password)) {
      toast.error("Password must contain at least one number");
      return false;
    }

    if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
      toast.error(
        "Password must contain at least one special character (!@#$%^&*)"
      );
      return false;
    }

    // Confirm Password validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };
  useEffect(() => {
    if (error) {
      // Check for unverified user with valid OTP case
      if (message?.includes("Please verify the OTP sent to your email")) {
        toast.info(message);
        // Redirect to OTP verification page with the email
        navigate("/otp-verify", {
          state: {
            email: formData.email,
            message: "Please enter the OTP sent to your email",
          },
        });
      } else {
        // Handle other errors normally
        toast.error(message || "An error occurred!");
      }
      // dispatch(clearError());
    }
    if (success) {
      toast.success(message || "Signup successful!");
      navigate("/otp-verify", {
        state: {
          email: formData.email,
          message: "Please check your email for the verification OTP",
        },
      });
      // dispatch(clearSuccess());
    }
  }, [error, success, message]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(register(formData));

    // if (validateForm()) {
    //   toast.success("Registration successful!");
    //   // Handle form submission here
    //   console.log(formData);
    // }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.01]">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text mb-2">
            GupShup
          </h1>
          <p className="text-gray-600">Create your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Full Name Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-150 ease-in-out"
              placeholder="Full Name"
              required
            />
          </div>

          {/* Username Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-150 ease-in-out"
              placeholder="Username"
              required
            />
          </div>

          {/* Email Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-150 ease-in-out"
              placeholder="Email address"
              required
            />
          </div>

          {/* Password Field */}
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

          {/* Confirm Password Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-150 ease-in-out"
              placeholder="Confirm Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-all duration-150 hover:scale-[1.02]"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
