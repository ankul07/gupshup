import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Grid,
  Bookmark,
  Tag,
  Menu,
  X,
  Settings,
  Info,
  HelpCircle,
  Save,
  Shield,
  LogOut,
} from "lucide-react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  updateProfile,
  clearSuccess,
  clearError,
} from "../redux/auth/authSlice";

// Edit Profile Modal Component
const EditProfileModal = ({ isOpen, onClose, profileData, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: profileData?.fullName,
    email: profileData?.email || "",
    mobile: profileData?.mobile || "",
    gender: profileData?.gender || "",
    username: profileData?.username,
    bio: profileData?.bio,
  });
  const dispatch = useDispatch();
  const { error, message, success } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      // Handle other errors normally
      toast.error(message || "An error occurred!");

      // dispatch(clearError());
    }
    if (success) {
      toast.success(message);
      // dispatch(clearSuccess());
    }
  }, [error, success, message]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile(formData));
    onUpdate(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Edit Profile</h2>
          <button onClick={onClose}>
            <X size={24} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              disabled
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              value={formData.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              disabled
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
