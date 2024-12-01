import express from "express";
import {
  healthStatus,
  welcomeMessage,
} from "../controllers/health.controller.js";

const healthRouter = express.Router();

healthRouter.get("/health", healthStatus);
healthRouter.get("/welcome", welcomeMessage);

export default healthRouter;