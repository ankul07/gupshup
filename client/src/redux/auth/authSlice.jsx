import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { toggleSavePost, toggleLikePost } from "../post/postSlice"; // Import post actions

// Initial State
const initialState = {
  isAuthenticated: false,
  loading: false,
  user: {},
  selectedUser: null,
  error: null,
  success: false,
  message: null,
  otpPurpose: null,
};

// Async Thunks
export const register = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/v1/user/create", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp, otpPurpose, deviceInfo }, { rejectWithValue }) => {
    try {
      const response = await api.post("/v1/user/verify-otp", {
        email,
        otp,
        otpPurpose,
        deviceInfo,
      });
      const accessToken = response.data.accessToken;
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resendOTP = createAsyncThunk(
  "auth/resendOTP",
  async ({ email, otpPurpose }, { rejectWithValue }) => {
    try {
      const response = await api.post("/v1/user/resend-otp", {
        email,
        otpPurpose,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/v1/user/login", formData);
      const accessToken = response.data.accessToken;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/v1/user/profile");
      console.log(
        "getprofilefunctionresponseforsavedffunctionpost",
        response.data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getSelectedUserProfile = createAsyncThunk(
  "auth/getSelectedUserProfile",
  async (username, { rejectWithValue }) => {
    try {
      const response = await api.get(`/v1/user/profile/${username}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProfileImage = createAsyncThunk(
  "auth/updateProfileImage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/v1/user/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.put("/v1/user/updateuser", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/v1/user/logout");
      localStorage.removeItem("accessToken");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.message = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = null;
      state.otpPurpose = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.isAuthenticated = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.otpPurpose = action.payload.otpPurpose;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload.error;
        state.user = null;
        state.success = action.payload.success;
        state.message = action.payload.error.message;
      })
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.isAuthenticated = true; // User is authenticated after OTP verification
        state.success = action.payload.success;
        state.message = action.payload.message;
        if (action.payload.data) {
          state.user = action.payload.data;
        }
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload.error;
        state.success = action.payload.success;
        state.message = action.payload.error.message;
      })

      // Resend OTP
      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(resendOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
        state.success = action.payload.success;
        state.message = action.payload.error.message;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.success = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        if (action.payload.otpPurpose) {
          state.isAuthenticated = false;
          state.otpPurpose = action.payload.otpPurpose;
          state.user = null;
        } else {
          state.isAuthenticated = true;
          state.user = action.payload.data;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload.error;
        state.success = action.payload.success;
        state.message = action.payload.error.message;
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data;
        state.error = null;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload.error;
        state.user = null;
        state.success = action.payload.success;
        state.message = action.payload.error
          ? action.payload.error.message
          : "Failed to fetch profile";
      })

      // Handle getUserProfile (Other User)
      .addCase(getSelectedUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSelectedUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload.data;
      })
      .addCase(getSelectedUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
        state.selectedUser = null;
      })
      .addCase(updateProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (state.user && action.payload.profilePictureUrl) {
          state.user.profilePictureUrl = action.payload.profilePictureUrl;
        }
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
        state.success = action.payload.success;
        state.message = action.payload.error.message;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.data;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
        state.success = action.payload.success;
        state.message = action.payload.error.message;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = null;
        state.isAuthenticated = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
        state.success = action.payload.success;
        state.message = action.payload.error.message;
      })

      // Add listener for toggleSavePost action
      .addCase(toggleSavePost.fulfilled, (state, action) => {
        if (state.user && state.user.savedPosts) {
          const postId = action.meta.arg;
          const isSaved = action.payload.isSaved;

          if (isSaved) {
            // Add post ID to savedPosts if not already there
            if (!state.user.savedPosts.includes(postId)) {
              state.user.savedPosts.push(postId);
            }
          } else {
            // Remove post ID from savedPosts
            state.user.savedPosts = state.user.savedPosts.filter(
              (id) => id !== postId
            );
          }
        }
      })

      // Add listener for toggleLikePost action
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        if (state.user && state.user.likedPosts) {
          const postId = action.meta.arg;
          const isLiked =
            action.payload.isLiked !== undefined
              ? action.payload.isLiked
              : action.payload.message.includes("liked");

          if (isLiked) {
            // Add post ID to likedPosts if not already there
            if (!state.user.likedPosts.includes(postId)) {
              state.user.likedPosts.push(postId);
            }
          } else {
            // Remove post ID from likedPosts
            state.user.likedPosts = state.user.likedPosts.filter(
              (id) => id !== postId
            );
          }
        }
      });
  },
});

export const { clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
