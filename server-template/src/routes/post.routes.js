import express from "express";
const router = express.Router();
import {
  createPost,
  getAllPost,
  // getPostById,
  likePost,
  savedPost,
  getSavedPosts,
  getSelectedUserPosts,
  getLikedPosts,
} from "../controllers/post.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";

router.post(
  "/create-post",
  isAuthenticated,
  upload.single("postImage"),
  createPost
);

router.get("/", isAuthenticated, getAllPost);
router.post("/savedpost/:postId", isAuthenticated, savedPost);
router.post("/likepost/:postId", isAuthenticated, likePost);
// router.get("/single-post/:postId", isAuthenticated, getPostById);
router.get("/getuserpost/:username", isAuthenticated, getSelectedUserPosts);
router.get("/savedpost", isAuthenticated, getSavedPosts);
router.get("/likedpost", isAuthenticated, getLikedPosts);

export default router;
