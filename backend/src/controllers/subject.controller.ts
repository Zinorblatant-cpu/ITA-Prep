import type { Request, Response } from "express";
import { z } from "zod";
import { subjectRepository } from "../repositories/subject.repository";
import { statisticsService } from "../services/statistics.service";
import { HttpError } from "../utils/http-error";
import type { SubjectDTO } from "@ita/shared-types";

function toDTO(row: ReturnType<typeof subjectRepository.findAll>[number]): SubjectDTO {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    color: row.color,
    icon: row.icon,
    targetPercentage: row.targetPercentage,
    createdAt: row.createdAt.toISOString(),
  };
}

const updateSubjectSchema = z.object({
  color: z.string().optional(),
  icon: z.string().optional(),
  targetPercentage: z.number().min(0).max(100).optional(),
});

export const subjectController = {
  list(_req: Request, res: Response) {
    const rows = subjectRepository.findAll();
    res.json({ data: rows.map(toDTO) });
  },

  getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const row = subjectRepository.findById(id);
    if (!row) throw HttpError.notFound("Disciplina não encontrada");
    res.json({ data: toDTO(row) });
  },

  update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const input = updateSubjectSchema.parse(req.body);
    const existing = subjectRepository.findById(id);
    if (!existing) throw HttpError.notFound("Disciplina não encontrada");
    const row = subjectRepository.update(id, input);
    res.json({ data: toDTO(row) });
  },

  stats(req: Request, res: Response) {
    const id = Number(req.params.id);
    const existing = subjectRepository.findById(id);
    if (!existing) throw HttpError.notFound("Disciplina não encontrada");
    res.json({ data: statisticsService.subjectStats(id) });
  },
};
