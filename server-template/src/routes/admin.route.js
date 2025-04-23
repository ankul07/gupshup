import express from "express";
const router = express.Router();
import { getAllUser } from "../controllers/admin.controller";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

router.get("/alluser", isAuthenticated, authorizeRoles("admin"), getAllUser);
export default router;
