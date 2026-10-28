import { Router } from "express";
import { errorNotebookController } from "../controllers/error-notebook.controller";
import { asyncHandler } from "../utils/async-handler";

export const errorNotebookRouter = Router();

errorNotebookRouter.get("/", asyncHandler(async (req, res) => errorNotebookController.list(req, res)));
errorNotebookRouter.post("/", asyncHandler(async (req, res) => errorNotebookController.create(req, res)));
errorNotebookRouter.get("/:id", asyncHandler(async (req, res) => errorNotebookController.getById(req, res)));
errorNotebookRouter.patch("/:id", asyncHandler(async (req, res) => errorNotebookController.update(req, res)));
errorNotebookRouter.delete("/:id", asyncHandler(async (req, res) => errorNotebookController.delete(req, res)));
