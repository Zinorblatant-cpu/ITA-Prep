import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller";
import { asyncHandler } from "../utils/async-handler";

export const dashboardRouter = Router();

dashboardRouter.get("/summary", asyncHandler(async (req, res) => dashboardController.summary(req, res)));
