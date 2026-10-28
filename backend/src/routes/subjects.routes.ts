import { Router } from "express";
import { subjectController } from "../controllers/subject.controller";
import { asyncHandler } from "../utils/async-handler";

export const subjectsRouter = Router();

subjectsRouter.get("/", asyncHandler(async (req, res) => subjectController.list(req, res)));
subjectsRouter.get("/:id", asyncHandler(async (req, res) => subjectController.getById(req, res)));
subjectsRouter.patch("/:id", asyncHandler(async (req, res) => subjectController.update(req, res)));
subjectsRouter.get("/:id/stats", asyncHandler(async (req, res) => subjectController.stats(req, res)));
