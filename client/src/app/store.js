import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../redux/auth/authSlice";
import postReducer from "../redux/post/postSlice";

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
  whitelist: ["posts", "userPosts", "currentPost"], // Persist these fields from posts state
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedPostReducer = persistReducer(postsPersistConfig, postReducer);

// Configure store with persisted reducers
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    posts: persistedPostReducer, // Now using the persisted posts reducer
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
