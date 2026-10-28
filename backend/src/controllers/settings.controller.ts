import type { Request, Response } from "express";
import { z } from "zod";
import { settingsRepository } from "../repositories/settings.repository";
import { subjectRepository } from "../repositories/subject.repository";
import { topicRepository } from "../repositories/topic.repository";
import { HttpError } from "../utils/http-error";
import type { MissingTopicSearchResultDTO } from "@ita/shared-types";

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().optional(),
  subjectId: z.number().optional(),
  totalPages: z.number().optional(),
  notes: z.string().optional(),
});

const courseSchema = z.object({
  name: z.string().min(1),
  platform: z.string().optional(),
  url: z.string().optional(),
  subjectId: z.number().optional(),
  notes: z.string().optional(),
});

const youtubeChannelSchema = z.object({
  name: z.string().min(1),
  url: z.string().optional(),
  subjectId: z.number().optional(),
});

const teacherSchema = z.object({
  name: z.string().min(1),
  subjectId: z.number().optional(),
  notes: z.string().optional(),
});

const appSettingsSchema = z.object({
  weeklyHourTarget: z.number().positive().optional(),
  examDate: z.string().optional(),
  themePreference: z.enum(["light", "dark", "system"]).optional(),
});

export const settingsController = {
  listBooks(_req: Request, res: Response) {
    res.json({ data: settingsRepository.listBooks() });
  },
  createBook(req: Request, res: Response) {
    const input = bookSchema.parse(req.body);
    res.status(201).json({ data: settingsRepository.createBook(input) });
  },
  updateBook(req: Request, res: Response) {
    const input = bookSchema.partial().parse(req.body);
    res.json({ data: settingsRepository.updateBook(Number(req.params.id), input) });
  },
  deleteBook(req: Request, res: Response) {
    settingsRepository.deleteBook(Number(req.params.id));
    res.status(204).send();
  },

  listCourses(_req: Request, res: Response) {
    res.json({ data: settingsRepository.listCourses() });
  },
  createCourse(req: Request, res: Response) {
    const input = courseSchema.parse(req.body);
    res.status(201).json({ data: settingsRepository.createCourse(input) });
  },
  updateCourse(req: Request, res: Response) {
    const input = courseSchema.partial().parse(req.body);
    res.json({ data: settingsRepository.updateCourse(Number(req.params.id), input) });
  },
  deleteCourse(req: Request, res: Response) {
    settingsRepository.deleteCourse(Number(req.params.id));
    res.status(204).send();
  },

  listYoutubeChannels(_req: Request, res: Response) {
    res.json({ data: settingsRepository.listYoutubeChannels() });
  },
  createYoutubeChannel(req: Request, res: Response) {
    const input = youtubeChannelSchema.parse(req.body);
    res.status(201).json({ data: settingsRepository.createYoutubeChannel(input) });
  },
  updateYoutubeChannel(req: Request, res: Response) {
    const input = youtubeChannelSchema.partial().parse(req.body);
    res.json({ data: settingsRepository.updateYoutubeChannel(Number(req.params.id), input) });
  },
  deleteYoutubeChannel(req: Request, res: Response) {
    settingsRepository.deleteYoutubeChannel(Number(req.params.id));
    res.status(204).send();
  },

  searchMissingTopicsOnChannel(req: Request, res: Response) {
    const channelId = Number(req.params.id);
    const channel = settingsRepository.getYoutubeChannelById(channelId);
    if (!channel) throw HttpError.notFound("Canal não encontrado");
    if (!channel.url) throw HttpError.badRequest("Este canal não tem um link cadastrado");

    const baseUrl = channel.url.replace(/\/+$/, "");
    const pendingTopics = topicRepository.findPending(channel.subjectId ?? undefined);
    const subjects = subjectRepository.findAll();

    const results: MissingTopicSearchResultDTO[] = pendingTopics.map((topic) => {
      const subject = subjects.find((s) => s.id === topic.subjectId);
      return {
        topicId: topic.id,
        topicName: topic.name,
        subjectName: subject?.name ?? "",
        searchUrl: `${baseUrl}/search?query=${encodeURIComponent(topic.name)}`,
      };
    });

    res.json({ data: results });
  },

  listTeachers(_req: Request, res: Response) {
    res.json({ data: settingsRepository.listTeachers() });
  },
  createTeacher(req: Request, res: Response) {
    const input = teacherSchema.parse(req.body);
    res.status(201).json({ data: settingsRepository.createTeacher(input) });
  },
  updateTeacher(req: Request, res: Response) {
    const input = teacherSchema.partial().parse(req.body);
    res.json({ data: settingsRepository.updateTeacher(Number(req.params.id), input) });
  },
  deleteTeacher(req: Request, res: Response) {
    settingsRepository.deleteTeacher(Number(req.params.id));
    res.status(204).send();
  },

  getAppSettings(_req: Request, res: Response) {
    const row = settingsRepository.getAppSettings();
    if (!row) throw HttpError.notFound("Configurações não inicializadas");
    res.json({
      data: {
        id: row.id,
        weeklyHourTarget: row.weeklyHourTarget,
        examDate: row.examDate.toISOString(),
        themePreference: row.themePreference,
        updatedAt: row.updatedAt.toISOString(),
      },
    });
  },
  updateAppSettings(req: Request, res: Response) {
    const input = appSettingsSchema.parse(req.body);
    const existing = settingsRepository.getAppSettings();
    if (!existing) throw HttpError.notFound("Configurações não inicializadas");
    const row = settingsRepository.updateAppSettings(existing.id, {
      ...input,
      examDate: input.examDate ? new Date(input.examDate) : undefined,
    });
    res.json({
      data: {
        id: row.id,
        weeklyHourTarget: row.weeklyHourTarget,
        examDate: row.examDate.toISOString(),
        themePreference: row.themePreference,
        updatedAt: row.updatedAt.toISOString(),
      },
    });
  },
};
