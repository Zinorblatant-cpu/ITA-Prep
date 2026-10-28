import { Router } from "express";
import { settingsController } from "../controllers/settings.controller";
import { asyncHandler } from "../utils/async-handler";

export const settingsRouter = Router();

settingsRouter.get("/books", asyncHandler(async (req, res) => settingsController.listBooks(req, res)));
settingsRouter.post("/books", asyncHandler(async (req, res) => settingsController.createBook(req, res)));
settingsRouter.patch("/books/:id", asyncHandler(async (req, res) => settingsController.updateBook(req, res)));
settingsRouter.delete("/books/:id", asyncHandler(async (req, res) => settingsController.deleteBook(req, res)));

settingsRouter.get("/courses", asyncHandler(async (req, res) => settingsController.listCourses(req, res)));
settingsRouter.post("/courses", asyncHandler(async (req, res) => settingsController.createCourse(req, res)));
settingsRouter.patch("/courses/:id", asyncHandler(async (req, res) => settingsController.updateCourse(req, res)));
settingsRouter.delete("/courses/:id", asyncHandler(async (req, res) => settingsController.deleteCourse(req, res)));

settingsRouter.get("/youtube-channels", asyncHandler(async (req, res) => settingsController.listYoutubeChannels(req, res)));
settingsRouter.post("/youtube-channels", asyncHandler(async (req, res) => settingsController.createYoutubeChannel(req, res)));
settingsRouter.patch("/youtube-channels/:id", asyncHandler(async (req, res) => settingsController.updateYoutubeChannel(req, res)));
settingsRouter.delete("/youtube-channels/:id", asyncHandler(async (req, res) => settingsController.deleteYoutubeChannel(req, res)));
settingsRouter.get("/youtube-channels/:id/missing-topics-search", asyncHandler(async (req, res) => settingsController.searchMissingTopicsOnChannel(req, res)));

settingsRouter.get("/teachers", asyncHandler(async (req, res) => settingsController.listTeachers(req, res)));
settingsRouter.post("/teachers", asyncHandler(async (req, res) => settingsController.createTeacher(req, res)));
settingsRouter.patch("/teachers/:id", asyncHandler(async (req, res) => settingsController.updateTeacher(req, res)));
settingsRouter.delete("/teachers/:id", asyncHandler(async (req, res) => settingsController.deleteTeacher(req, res)));

settingsRouter.get("/app", asyncHandler(async (req, res) => settingsController.getAppSettings(req, res)));
settingsRouter.patch("/app", asyncHandler(async (req, res) => settingsController.updateAppSettings(req, res)));
