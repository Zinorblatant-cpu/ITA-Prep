import { Router } from "express";
import { gamificationController } from "../controllers/gamification.controller";
import { asyncHandler } from "../utils/async-handler";

export const gamificationRouter = Router();

gamificationRouter.get("/profile", asyncHandler(async (req, res) => gamificationController.profile(req, res)));
gamificationRouter.get("/achievements", asyncHandler(async (req, res) => gamificationController.achievements(req, res)));
gamificationRouter.get("/xp-log", asyncHandler(async (req, res) => gamificationController.xpLog(req, res)));
