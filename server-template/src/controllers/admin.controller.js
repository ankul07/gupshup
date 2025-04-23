import { User } from "../models/user.model.js";
import { Post } from "../models/post.modal.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const getAllUser = asyncHandler(async (req, res, next) => {
  res.send("admin routees here");
});
