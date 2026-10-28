import { Router } from "express";
import { reviewController } from "../controllers/review.controller";
import { asyncHandler } from "../utils/async-handler";

export const reviewsRouter = Router();

reviewsRouter.get("/", asyncHandler(async (req, res) => reviewController.list(req, res)));
reviewsRouter.get("/upcoming", asyncHandler(async (req, res) => reviewController.upcoming(req, res)));
reviewsRouter.patch("/:id/complete", asyncHandler(async (req, res) => reviewController.complete(req, res)));
reviewsRouter.patch("/:id/skip", asyncHandler(async (req, res) => reviewController.skip(req, res)));
