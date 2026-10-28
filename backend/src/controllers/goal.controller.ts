import type { Request, Response } from "express";
import { z } from "zod";
import { goalRepository } from "../repositories/goal.repository";
import { studySessionRepository } from "../repositories/study-session.repository";
import { questionRepository } from "../repositories/question.repository";
import { reviewRepository } from "../repositories/review.repository";
import { mockExamRepository } from "../repositories/mock-exam.repository";
import { HttpError } from "../utils/http-error";
import type { GoalDTO, GoalProgressDTO } from "@ita/shared-types";

function toDTO(row: NonNullable<ReturnType<typeof goalRepository.findById>>): GoalDTO {
  return {
    id: row.id,
    type: row.type,
    metric: row.metric,
    targetValue: row.targetValue,
    periodStart: row.periodStart.toISOString(),
    periodEnd: row.periodEnd.toISOString(),
    createdAt: row.createdAt.toISOString(),
  };
}

function computeCurrentValue(row: NonNullable<ReturnType<typeof goalRepository.findById>>): number {
  const start = row.periodStart.getTime();
  const end = row.periodEnd.getTime();

  switch (row.metric) {
    case "horas_estudo": {
      const sessions = studySessionRepository.findAllFinished();
      const seconds = sessions
        .filter((s) => s.startedAt.getTime() >= start && s.startedAt.getTime() <= end)
        .reduce((sum, s) => sum + (s.durationSeconds ?? 0), 0);
      return seconds / 3600;
    }
    case "questoes_resolvidas": {
      return questionRepository
        .findAll()
        .filter((q) => q.createdAt.getTime() >= start && q.createdAt.getTime() <= end).length;
    }
    case "revisoes": {
      return reviewRepository
        .findMany({ status: "concluida" })
        .filter((r) => (r.completedAt?.getTime() ?? 0) >= start && (r.completedAt?.getTime() ?? 0) <= end)
        .length;
    }
    case "simulados": {
      return mockExamRepository
        .findAll()
        .filter((m) => m.examDate.getTime() >= start && m.examDate.getTime() <= end).length;
    }
    default:
      return 0;
  }
}

const createSchema = z.object({
  type: z.enum(["diaria", "semanal", "mensal", "anual"]),
  metric: z.enum(["horas_estudo", "questoes_resolvidas", "revisoes", "simulados"]),
  targetValue: z.number().positive(),
  periodStart: z.string(),
  periodEnd: z.string(),
});

export const goalController = {
  list(req: Request, res: Response) {
    const { type } = req.query;
    const rows = goalRepository.findMany(typeof type === "string" ? type : undefined);
    res.json({ data: rows.map(toDTO) });
  },

  create(req: Request, res: Response) {
    const input = createSchema.parse(req.body);
    const row = goalRepository.create({
      ...input,
      periodStart: new Date(input.periodStart),
      periodEnd: new Date(input.periodEnd),
    });
    res.status(201).json({ data: toDTO(row) });
  },

  progress(req: Request, res: Response) {
    const id = Number(req.params.id);
    const row = goalRepository.findById(id);
    if (!row) throw HttpError.notFound("Meta não encontrada");

    const currentValue = computeCurrentValue(row);
    const dto: GoalProgressDTO = {
      goal: toDTO(row),
      currentValue: Math.round(currentValue * 100) / 100,
      percentage: Math.min(Math.round((currentValue / row.targetValue) * 100), 100),
      achieved: currentValue >= row.targetValue,
    };
    res.json({ data: dto });
  },

  delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    const existing = goalRepository.findById(id);
    if (!existing) throw HttpError.notFound("Meta não encontrada");
    goalRepository.delete(id);
    res.status(204).send();
  },
};
