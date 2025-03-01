import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { AtomIcon } from "lucide-react";

// Initial State
const initialState = {
  isAuthenticated: false,
  loading: false,
  user: {},
  error: null,
  success: false,
  message: null,
};

// Async Thunks
export const register = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/v1/user/create", formData);
      console.log(response);
      console.log(response.data);

      return response.data;
    } catch (error) {
      console.log(error);
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    // console.log(email);
    try {
      const response = await api.post("/v1/user/verify-otp", { email, otp });
      const accessToken = response.data.accessToken;
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      // console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resendOTP = createAsyncThunk(
  "auth/resendOTP",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await api.post("/v1/user/resend-otp", { email });
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
      // console.log(response);
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
      // console.log(formData);
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
        // state.user = action.payload.data;
        state.success = action.payload.success;
        state.message = action.payload.message;
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

      //   // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.success = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload.error;
        state.success = action.payload.success;
        state.message = action.payload.error.message;
      })
      //   // Get Profile
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
        // state.message = action.payload.data.message;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload.error;
        state.user = null;
        state.success = action.payload.success;
        // state.message = action.payload.error.message;
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
      .addCase(updateProfile.pending, (state, action) => {
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
      .addCase(logout.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = null;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
        state.success = action.payload.success;
        state.message = action.payload.error.message;
      });
  },
});

export const { clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
