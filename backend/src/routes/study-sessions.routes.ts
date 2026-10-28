import { Router } from "express";
import { studySessionController } from "../controllers/study-session.controller";
import { asyncHandler } from "../utils/async-handler";

export const studySessionsRouter = Router();

studySessionsRouter.get("/", asyncHandler(async (req, res) => studySessionController.list(req, res)));
studySessionsRouter.post("/start", asyncHandler(async (req, res) => studySessionController.start(req, res)));
studySessionsRouter.patch("/:id/finish", asyncHandler(async (req, res) => studySessionController.finish(req, res)));
studySessionsRouter.get("/:id", asyncHandler(async (req, res) => studySessionController.getById(req, res)));
studySessionsRouter.delete("/:id", asyncHandler(async (req, res) => studySessionController.delete(req, res)));
