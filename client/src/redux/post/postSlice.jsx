import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const initialState = {
  posts: [],
  selecteduserPosts: [],
  savedPosts: [],
  likedPosts: [],
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
  "posts/toggleSavePost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/v1/post/savedpost/${postId}`);
      console.log("togglesavepostdata", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleLikePost = createAsyncThunk(
  "posts/toggleLikePost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/v1/post/likepost/${postId}`);
      console.log("toggle like post response post slice", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getSelectedUserPost = createAsyncThunk(
  "posts/getSelectedUserPost",
  async (username, { rejectWithValue }) => {
    // console.log("Inside getSelectedUserPost thunk with username:", username);
    try {
      // console.log("Making API request for username:", username);
      const response = await api.get(`/v1/post/getuserpost/${username}`);
      // console.log("API response received:", response);
      return response.data;
    } catch (error) {
      console.error("API request failed:", error);
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const getSavedPosts = createAsyncThunk(
  "posts/getSavedPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/v1/post/savedpost`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const getLikedPosts = createAsyncThunk(
  "posts/getLikedPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/v1/post/likedpost`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
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
      state.selecteduserPosts = [];
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
          state.selecteduserPosts.unshift(action.payload.data.post);
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
        state.posts = action.payload.data || [];
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

        // Get the isSaved status from the response
        const isSaved = action.payload.isSaved;

        // Find and update the post's save status in the posts array
        const postIndex = state.posts.findIndex(
          (post) => post.id === action.meta.arg
        );
        if (postIndex !== -1) {
          state.posts[postIndex].metadata = {
            ...state.posts[postIndex].metadata,
            isSavedByMe: isSaved,
          };
        }

        // Also update in selecteduserPosts if present
        const userPostIndex = state.selecteduserPosts.findIndex(
          (post) => post.id === action.meta.arg
        );
        if (userPostIndex !== -1) {
          state.selecteduserPosts[userPostIndex].metadata = {
            ...state.selecteduserPosts[userPostIndex].metadata,
            isSavedByMe: isSaved,
          };
        }

        // If this is the current post, update it too
        if (state.currentPost && state.currentPost.id === action.meta.arg) {
          state.currentPost.metadata = {
            ...state.currentPost.metadata,
            isSavedByMe: isSaved,
          };
        }
      })
      .addCase(toggleSavePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || {
          message: "Failed to toggle save status",
        };
      })

      .addCase(toggleLikePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(toggleLikePost.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;

        // Get the isLiked status directly from response data instead of checking message
        const isLiked =
          action.payload.isLiked !== undefined
            ? action.payload.isLiked
            : action.payload.message.includes("liked");

        // Find and update the post's like status and count in the posts array
        const postIndex = state.posts.findIndex(
          (post) => post.id === action.meta.arg
        );
        if (postIndex !== -1 && state.posts[postIndex].metadata) {
          state.posts[postIndex].metadata = {
            ...state.posts[postIndex].metadata,
            isLikedByMe: isLiked,
            likesCount:
              action.payload.likesCount ||
              state.posts[postIndex].metadata.likesCount,
          };
        }

        // Also update in selecteduserPosts if present
        const userPostIndex = state.selecteduserPosts.findIndex(
          (post) => post.id === action.meta.arg
        );
        if (
          userPostIndex !== -1 &&
          state.selecteduserPosts[userPostIndex].metadata
        ) {
          state.selecteduserPosts[userPostIndex].metadata = {
            ...state.selecteduserPosts[userPostIndex].metadata,
            isLikedByMe: isLiked,
            likesCount:
              action.payload.likesCount ||
              state.selecteduserPosts[userPostIndex].metadata.likesCount,
          };
        }

        // If this is the current post, update it too
        if (
          state.currentPost &&
          state.currentPost.id === action.meta.arg &&
          state.currentPost.metadata
        ) {
          state.currentPost.metadata = {
            ...state.currentPost.metadata,
            isLikedByMe: isLiked,
            likesCount:
              action.payload.likesCount ||
              state.currentPost.metadata.likesCount,
          };
        }
      })

      .addCase(toggleLikePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || {
          message: "Failed to toggle like status",
        };
      })

      .addCase(getSelectedUserPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSelectedUserPost.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Store the fetched posts
        state.selecteduserPosts = action.payload.data || [];
      })
      .addCase(getSelectedUserPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Failed to fetch user posts",
        };
      })
      .addCase(getSavedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSavedPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.savedPosts = action.payload.data || [];
      })
      .addCase(getSavedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Failed to fetch saved posts",
        };
      })
      .addCase(getLikedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLikedPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.likedPosts = action.payload.data || [];
      })
      .addCase(getLikedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Failed to fetch liked posts",
        };
      });
  },
});

export const { clearPostErrors, resetPostState, logoutPostState } =
  postSlice.actions;
export default postSlice.reducer;
