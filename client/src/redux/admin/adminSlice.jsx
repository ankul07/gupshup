import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Get all users
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/v1/admin/alluser");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to fetch users"
      );
    }
  }
);

// Get all posts
export const fetchAllPosts = createAsyncThunk(
  "admin/fetchAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/v1/admin/allposts");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to fetch posts"
      );
    }
  }
);

// Delete post
export const deletePost = createAsyncThunk(
  "admin/deletePost",
  async (postId, thunkAPI) => {
    try {
      const response = await api.delete(`/v1/admin/delete/${postId}`);
      return { ...response.data, postId };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to delete post"
      );
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  success: false,
  message: null,
  users: [], // all users list
  posts: [],
  selectedUser: null, // for editing or viewing profile
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
    selectUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.success = true;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all posts
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.data;
        state.success = true;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.data;
        state.success = true;
        state.message = "Post deleted successfully";
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminState, selectUser } = adminSlice.actions;
export default adminSlice.reducer;
