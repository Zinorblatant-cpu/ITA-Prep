import { Router } from "express";
import { calendarController } from "../controllers/calendar.controller";
import { asyncHandler } from "../utils/async-handler";

export const calendarRouter = Router();

calendarRouter.get("/", asyncHandler(async (req, res) => calendarController.month(req, res)));
