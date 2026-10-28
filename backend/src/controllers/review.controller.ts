import type { Request, Response } from "express";
import { z } from "zod";
import { reviewRepository } from "../repositories/review.repository";
import { topicRepository } from "../repositories/topic.repository";
import { subjectRepository } from "../repositories/subject.repository";
import { spacedRepetitionService } from "../services/spaced-repetition.service";
import { gamificationService } from "../services/gamification.service";
import { HttpError } from "../utils/http-error";
import type { ReviewDTO } from "@ita/shared-types";

function toDTO(row: NonNullable<ReturnType<typeof reviewRepository.findById>>): ReviewDTO {
  const topic = topicRepository.findById(row.topicId);
  const subject = topic ? subjectRepository.findById(topic.subjectId) : undefined;
  const isLate = row.status === "pendente" && row.scheduledDate.getTime() < Date.now();

  return {
    id: row.id,
    topicId: row.topicId,
    topicName: topic?.name ?? "",
    subjectId: topic?.subjectId ?? 0,
    subjectName: subject?.name ?? "",
    originSessionId: row.originSessionId,
    scheduledDate: row.scheduledDate.toISOString(),
    intervalDays: row.intervalDays as ReviewDTO["intervalDays"],
    status: isLate ? "atrasada" : row.status,
    completedAt: row.completedAt ? row.completedAt.toISOString() : null,
    performanceRating: row.performanceRating,
    notes: row.notes,
    createdAt: row.createdAt.toISOString(),
  };
}

const completeSchema = z.object({
  performanceRating: z.enum(["ruim", "medio", "bom"]),
  notes: z.string().optional(),
});

export const reviewController = {
  list(req: Request, res: Response) {
    const { status, from, to } = req.query;
    const rows = reviewRepository.findMany({
      status: typeof status === "string" ? status : undefined,
      from: from ? new Date(String(from)) : undefined,
      to: to ? new Date(String(to)) : undefined,
    });
    res.json({ data: rows.map(toDTO) });
  },

  upcoming(_req: Request, res: Response) {
    const rows = reviewRepository.findMany({ status: "pendente" });
    const sorted = rows.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
    res.json({ data: sorted.slice(0, 10).map(toDTO) });
  },

  complete(req: Request, res: Response) {
    const id = Number(req.params.id);
    const input = completeSchema.parse(req.body);
    const existing = reviewRepository.findById(id);
    if (!existing) throw HttpError.notFound("Revisão não encontrada");

    const row = reviewRepository.update(id, {
      status: "concluida",
      completedAt: new Date(),
      performanceRating: input.performanceRating,
      notes: input.notes,
    });

    spacedRepetitionService.rescheduleIfPoor(existing.topicId, input.performanceRating);
    const gamificationResult = gamificationService.registerReviewCompleted(input.performanceRating);

    res.json({
      data: {
        review: toDTO(row!),
        xpEarned: gamificationResult.xpEarned,
        levelUp: gamificationResult.levelUp,
      },
    });
  },

  skip(req: Request, res: Response) {
    const id = Number(req.params.id);
    const existing = reviewRepository.findById(id);
    if (!existing) throw HttpError.notFound("Revisão não encontrada");
    const row = reviewRepository.update(id, { status: "pulada" });
    res.json({ data: toDTO(row!) });
  },
};
