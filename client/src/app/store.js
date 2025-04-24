import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../redux/auth/authSlice";
import postReducer from "../redux/post/postSlice";
import adminReducer from "../redux/admin/adminSlice";

// Auth persist configuration
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["isAuthenticated", "user"],
};

// Posts persist configuration
const postsPersistConfig = {
  key: "posts",
  storage,
  whitelist: ["posts", "selecteduserPosts", "savedPosts", "likedPosts"], // Persist these fields from posts state
};
// Admin persist configuration
const adminPersistConfig = {
  key: "admin",
  storage,
  whitelist: ["users", "selectedUser"], // Only persist users list and selected user
};
// Create persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedPostReducer = persistReducer(postsPersistConfig, postReducer);
const persistedAdminReducer = persistReducer(adminPersistConfig, adminReducer);

// Configure store with persisted reducers
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    posts: persistedPostReducer,
    admin: persistedAdminReducer, // Now using the persisted posts reducer
    // Add other reducers here as you create them
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
