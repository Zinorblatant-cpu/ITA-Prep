import { Router } from "express";
import { topicController } from "../controllers/topic.controller";
import { asyncHandler } from "../utils/async-handler";

export const topicsRouter = Router();

topicsRouter.get("/", asyncHandler(async (req, res) => topicController.listBySubject(req, res)));
topicsRouter.post("/", asyncHandler(async (req, res) => topicController.create(req, res)));
topicsRouter.get("/:id", asyncHandler(async (req, res) => topicController.getById(req, res)));
topicsRouter.patch("/:id", asyncHandler(async (req, res) => topicController.update(req, res)));
topicsRouter.delete("/:id", asyncHandler(async (req, res) => topicController.delete(req, res)));
topicsRouter.post("/:id/complete", asyncHandler(async (req, res) => topicController.complete(req, res)));
