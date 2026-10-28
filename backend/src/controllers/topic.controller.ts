import type { Request, Response } from "express";
import { z } from "zod";
import { topicRepository } from "../repositories/topic.repository";
import { spacedRepetitionService } from "../services/spaced-repetition.service";
import { HttpError } from "../utils/http-error";
import type { TopicDTO } from "@ita/shared-types";

function toDTO(row: ReturnType<typeof topicRepository.findById>): TopicDTO {
  if (!row) throw HttpError.notFound("Conteúdo não encontrado");
  return {
    id: row.id,
    subjectId: row.subjectId,
    name: row.name,
    description: row.description,
    orderIndex: row.orderIndex,
    difficulty: row.difficulty,
    priority: row.priority,
    progressPercentage: row.progressPercentage,
    status: row.status,
    startedAt: row.startedAt ? row.startedAt.toISOString() : null,
    completedAt: row.completedAt ? row.completedAt.toISOString() : null,
    notes: row.notes,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

const createTopicSchema = z.object({
  subjectId: z.number(),
  name: z.string().min(1),
  description: z.string().optional(),
  orderIndex: z.number().optional(),
  difficulty: z.enum(["facil", "medio", "dificil"]).optional(),
  priority: z.enum(["baixa", "media", "alta"]).optional(),
  notes: z.string().optional(),
});

const updateTopicSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  orderIndex: z.number().optional(),
  difficulty: z.enum(["facil", "medio", "dificil"]).optional(),
  priority: z.enum(["baixa", "media", "alta"]).optional(),
  notes: z.string().optional(),
  progressPercentage: z.number().min(0).max(100).optional(),
  status: z.enum(["nao_iniciado", "em_andamento", "concluido", "revisao"]).optional(),
});

export const topicController = {
  listBySubject(req: Request, res: Response) {
    const subjectId = Number(req.query.subjectId);
    if (!subjectId) throw HttpError.badRequest("subjectId é obrigatório");
    const rows = topicRepository.findBySubject(subjectId);
    res.json({ data: rows.map((row) => toDTO(row)) });
  },

  getById(req: Request, res: Response) {
    const row = topicRepository.findById(Number(req.params.id));
    res.json({ data: toDTO(row) });
  },

  create(req: Request, res: Response) {
    const input = createTopicSchema.parse(req.body);
    const row = topicRepository.create({ ...input, status: "nao_iniciado" });
    res.status(201).json({ data: toDTO(row) });
  },

  update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const input = updateTopicSchema.parse(req.body);
    const existing = topicRepository.findById(id);
    if (!existing) throw HttpError.notFound("Conteúdo não encontrado");

    const patch: Record<string, unknown> = { ...input };
    if (input.status === "em_andamento" && !existing.startedAt) {
      patch.startedAt = new Date();
    }

    const row = topicRepository.update(id, patch as never);
    res.json({ data: toDTO(row) });
  },

  delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    const existing = topicRepository.findById(id);
    if (!existing) throw HttpError.notFound("Conteúdo não encontrado");
    topicRepository.delete(id);
    res.status(204).send();
  },

  complete(req: Request, res: Response) {
    const id = Number(req.params.id);
    const existing = topicRepository.findById(id);
    if (!existing) throw HttpError.notFound("Conteúdo não encontrado");

    const completedAt = new Date();
    const row = topicRepository.update(id, {
      status: "concluido",
      progressPercentage: 100,
      completedAt,
      startedAt: existing.startedAt ?? completedAt,
    });

    const reviews = spacedRepetitionService.scheduleReviewsForTopic(id, completedAt);

    res.json({ data: { topic: toDTO(row), reviewsGenerated: reviews.length } });
  },
};
