import express from "express";
const router = express.Router();
import {
  getAllPosts,
  getAllUser,
  deletePostByAdmin,
} from "../controllers/admin.controller.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

router.get("/alluser", isAuthenticated, authorizeRoles("admin"), getAllUser);
router.get("/allposts", isAuthenticated, authorizeRoles("admin"), getAllPosts);
router.delete(
  "/delete/:postId",
  isAuthenticated,
  authorizeRoles("admin"),
  deletePostByAdmin
);

export default router;
