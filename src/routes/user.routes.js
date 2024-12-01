import express from "express";
import {
  register,
  login,
  uploadAssignment,
  fetchAdmins,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);

userRouter.post("/upload", verifyToken, uploadAssignment);
userRouter.get("/admins", verifyToken, fetchAdmins);

export default userRouter;
