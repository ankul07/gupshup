import express from "express";
const router = express.Router();
import {
  createPost,
  getAllPost,
  getPostById,
  savedPost,
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
router.get("/single-post/:postId", isAuthenticated, getPostById);

export default router;
