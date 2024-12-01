import express from "express";
import {
  acceptAssignment,
  login,
  register,
  rejectAssignment,
  viewAssignments,
} from "../controllers/admin.controller.js";
import { isAdmin, verifyToken } from "../middleware/auth.middleware.js";

const adminRouter = express.Router();

adminRouter.post("/register", register);
adminRouter.post("/login", login);

adminRouter.get("/assignments", verifyToken, isAdmin, viewAssignments);

adminRouter.post(
  "/assignments/:id/accept",
  verifyToken,
  isAdmin,
  acceptAssignment
);

adminRouter.post(
  "/assignments/:id/reject",
  verifyToken,
  isAdmin,
  rejectAssignment
);

export default adminRouter;