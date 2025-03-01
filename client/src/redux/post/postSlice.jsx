import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const initialState = {
  posts: [],
  userPosts: [],
  currentPost: null,
  loading: false,
  error: null,
  success: false,
  message: null,
};
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/v1/post/create-post", formData, {
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

export const getAllPosts = createAsyncThunk(
  "posts/getAllPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/v1/post");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const toggleSavePost = createAsyncThunk(
  "posts/toggleSavePost", // Changed the name to be more descriptive
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/v1/post/savedpost/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearPostErrors: (state) => {
      state.error = null;
      state.success = false;
      state.message = null;
    },
    resetPostState: (state) => {
      state.success = false;
      state.message = null;
    },
    logoutPostState: (state) => {
      state.posts = [];
      state.userPosts = [];
      state.currentPost = null;
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.error = null;
        state.message = action.payload.message;
        if (action.payload.data?.post) {
          state.posts.unshift(action.payload.data.post);
          state.userPosts.unshift(action.payload.data.post);
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || {
          message: "Failed to create post",
        };
        state.success = false;
        state.message = action.payload?.message || "An error occurred";
      })

      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.data;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || {
          message: "Failed to fetch posts",
        };
      })
      .addCase(toggleSavePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleSavePost.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;

        // Find and update the post's save status in the posts array
        const postIndex = state.posts.findIndex(
          (post) => post.id === action.meta.arg
        );
        if (postIndex !== -1) {
          state.posts[postIndex].metadata.isSavedByMe = action.payload.isSaved;
        }

        // Also update in userPosts if present
        const userPostIndex = state.userPosts.findIndex(
          (post) => post.id === action.meta.arg
        );
        if (userPostIndex !== -1) {
          state.userPosts[userPostIndex].metadata.isSavedByMe =
            action.payload.isSaved;
        }

        // If this is the current post, update it too
        if (state.currentPost && state.currentPost.id === action.meta.arg) {
          state.currentPost.metadata.isSavedByMe = action.payload.isSaved;
        }
      })
      .addCase(toggleSavePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || {
          message: "Failed to toggle save status",
        };
      });
  },
});

export const { clearPostErrors, resetPostState, logoutPostState } =
  postSlice.actions;
export default postSlice.reducer;
