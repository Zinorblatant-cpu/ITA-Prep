import { Router } from "express";
import { questionController } from "../controllers/question.controller";
import { asyncHandler } from "../utils/async-handler";

export const questionsRouter = Router();

questionsRouter.get("/", asyncHandler(async (req, res) => questionController.list(req, res)));
questionsRouter.post("/", asyncHandler(async (req, res) => questionController.create(req, res)));
questionsRouter.patch("/:id", asyncHandler(async (req, res) => questionController.update(req, res)));
questionsRouter.delete("/:id", asyncHandler(async (req, res) => questionController.delete(req, res)));
