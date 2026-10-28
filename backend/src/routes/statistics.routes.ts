import { Router } from "express";
import { statisticsController } from "../controllers/statistics.controller";
import { asyncHandler } from "../utils/async-handler";

export const statisticsRouter = Router();

statisticsRouter.get("/hours", asyncHandler(async (req, res) => statisticsController.hours(req, res)));
statisticsRouter.get("/questions", asyncHandler(async (req, res) => statisticsController.questions(req, res)));
statisticsRouter.get("/accuracy-by-subject", asyncHandler(async (req, res) => statisticsController.accuracyBySubject(req, res)));
statisticsRouter.get("/heatmap", asyncHandler(async (req, res) => statisticsController.heatmap(req, res)));
statisticsRouter.get("/weak-strong-topics", asyncHandler(async (req, res) => statisticsController.weakStrongTopics(req, res)));
