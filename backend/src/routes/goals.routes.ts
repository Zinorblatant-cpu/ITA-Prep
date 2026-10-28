import { Router } from "express";
import { goalController } from "../controllers/goal.controller";
import { asyncHandler } from "../utils/async-handler";

export const goalsRouter = Router();

goalsRouter.get("/", asyncHandler(async (req, res) => goalController.list(req, res)));
goalsRouter.post("/", asyncHandler(async (req, res) => goalController.create(req, res)));
goalsRouter.get("/:id/progress", asyncHandler(async (req, res) => goalController.progress(req, res)));
goalsRouter.delete("/:id", asyncHandler(async (req, res) => goalController.delete(req, res)));
