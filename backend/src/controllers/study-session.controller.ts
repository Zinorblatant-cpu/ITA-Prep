import type { Request, Response } from "express";
import { z } from "zod";
import { studySessionRepository } from "../repositories/study-session.repository";
import { gamificationService } from "../services/gamification.service";
import { HttpError } from "../utils/http-error";
import type { StudySessionDTO } from "@ita/shared-types";

function toDTO(row: NonNullable<ReturnType<typeof studySessionRepository.findById>>): StudySessionDTO {
  return {
    id: row.id,
    subjectId: row.subjectId,
    topicId: row.topicId,
    bookId: row.bookId,
    youtubeChannelId: row.youtubeChannelId,
    teacherId: row.teacherId,
    type: row.type,
    startedAt: row.startedAt.toISOString(),
    endedAt: row.endedAt ? row.endedAt.toISOString() : null,
    durationSeconds: row.durationSeconds,
    exercisesTotal: row.exercisesTotal,
    exercisesCorrect: row.exercisesCorrect,
    exercisesWrong: row.exercisesWrong,
    notes: row.notes,
    xpEarned: row.xpEarned,
    createdAt: row.createdAt.toISOString(),
  };
}

const startSchema = z.object({
  subjectId: z.number(),
  topicId: z.number().optional(),
  bookId: z.number().optional(),
  youtubeChannelId: z.number().optional(),
  teacherId: z.number().optional(),
  type: z.enum(["teoria", "exercicios", "revisao", "simulado"]),
});

const finishSchema = z.object({
  exercisesTotal: z.number().min(0).optional(),
  exercisesCorrect: z.number().min(0).optional(),
  exercisesWrong: z.number().min(0).optional(),
  notes: z.string().optional(),
  endedAt: z.string().optional(),
});

export const studySessionController = {
  list(req: Request, res: Response) {
    const { subjectId, type, from, to } = req.query;
    const rows = studySessionRepository.findMany({
      subjectId: subjectId ? Number(subjectId) : undefined,
      type: typeof type === "string" ? type : undefined,
      from: from ? new Date(String(from)) : undefined,
      to: to ? new Date(String(to)) : undefined,
    });
    res.json({ data: rows.map(toDTO) });
  },

  getById(req: Request, res: Response) {
    const row = studySessionRepository.findById(Number(req.params.id));
    if (!row) throw HttpError.notFound("Sessão de estudo não encontrada");
    res.json({ data: toDTO(row) });
  },

  start(req: Request, res: Response) {
    const input = startSchema.parse(req.body);
    const row = studySessionRepository.start({ ...input, startedAt: new Date() });
    res.status(201).json({ data: toDTO(row) });
  },

  finish(req: Request, res: Response) {
    const id = Number(req.params.id);
    const input = finishSchema.parse(req.body);
    const existing = studySessionRepository.findById(id);
    if (!existing) throw HttpError.notFound("Sessão de estudo não encontrada");
    if (existing.endedAt) throw HttpError.badRequest("Sessão já foi finalizada");

    const endedAt = input.endedAt ? new Date(input.endedAt) : new Date();
    const durationSeconds = Math.max(
      Math.round((endedAt.getTime() - existing.startedAt.getTime()) / 1000),
      0,
    );

    const exercisesTotal = input.exercisesTotal ?? 0;
    const exercisesCorrect = input.exercisesCorrect ?? 0;
    const exercisesWrong = input.exercisesWrong ?? Math.max(exercisesTotal - exercisesCorrect, 0);

    const gamificationResult = gamificationService.registerStudySession(
      durationSeconds,
      exercisesTotal,
      exercisesCorrect,
    );

    const row = studySessionRepository.finish(id, {
      endedAt,
      durationSeconds,
      exercisesTotal,
      exercisesCorrect,
      exercisesWrong,
      notes: input.notes,
      xpEarned: gamificationResult.xpEarned,
    });

    res.json({
      data: {
        session: toDTO(row!),
        xpEarned: gamificationResult.xpEarned,
        currentStreak: gamificationResult.currentStreak,
        streakChanged: gamificationResult.streakChanged,
        levelUp: gamificationResult.levelUp,
        newLevel: gamificationResult.level,
      },
    });
  },

  delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    const existing = studySessionRepository.findById(id);
    if (!existing) throw HttpError.notFound("Sessão de estudo não encontrada");
    studySessionRepository.delete(id);
    res.status(204).send();
  },
};
