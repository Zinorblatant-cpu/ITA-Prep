import { Router } from "express";
import { mockExamController } from "../controllers/mock-exam.controller";
import { asyncHandler } from "../utils/async-handler";

export const mockExamsRouter = Router();

mockExamsRouter.get("/", asyncHandler(async (req, res) => mockExamController.list(req, res)));
mockExamsRouter.post("/", asyncHandler(async (req, res) => mockExamController.create(req, res)));
mockExamsRouter.get("/comparison", asyncHandler(async (req, res) => mockExamController.comparison(req, res)));
mockExamsRouter.get("/:id", asyncHandler(async (req, res) => mockExamController.getById(req, res)));
mockExamsRouter.patch("/:id", asyncHandler(async (req, res) => mockExamController.update(req, res)));
mockExamsRouter.delete("/:id", asyncHandler(async (req, res) => mockExamController.delete(req, res)));
