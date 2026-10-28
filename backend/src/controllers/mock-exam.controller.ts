import type { Request, Response } from "express";
import { z } from "zod";
import { mockExamRepository } from "../repositories/mock-exam.repository";
import { gamificationService } from "../services/gamification.service";
import { HttpError } from "../utils/http-error";
import type { MockExamComparisonDTO, MockExamDTO } from "@ita/shared-types";

function toDTO(row: NonNullable<ReturnType<typeof mockExamRepository.findById>>): MockExamDTO {
  return {
    id: row.id,
    examDate: row.examDate.toISOString(),
    name: row.name,
    totalQuestions: row.totalQuestions,
    correctAnswers: row.correctAnswers,
    durationSeconds: row.durationSeconds,
    score: row.score,
    subjectBreakdown: row.subjectBreakdown ?? [],
    notes: row.notes,
    createdAt: row.createdAt.toISOString(),
  };
}

const subjectBreakdownSchema = z.object({
  subjectId: z.number(),
  correct: z.number(),
  total: z.number(),
});

const createSchema = z.object({
  examDate: z.string(),
  name: z.string().min(1),
  totalQuestions: z.number().positive(),
  correctAnswers: z.number().min(0),
  durationSeconds: z.number().positive(),
  score: z.number().optional(),
  subjectBreakdown: z.array(subjectBreakdownSchema).optional(),
  notes: z.string().optional(),
});

export const mockExamController = {
  list(_req: Request, res: Response) {
    const rows = mockExamRepository.findAll();
    res.json({ data: rows.map(toDTO) });
  },

  getById(req: Request, res: Response) {
    const row = mockExamRepository.findById(Number(req.params.id));
    if (!row) throw HttpError.notFound("Simulado não encontrado");
    res.json({ data: toDTO(row) });
  },

  create(req: Request, res: Response) {
    const input = createSchema.parse(req.body);
    const row = mockExamRepository.create({ ...input, examDate: new Date(input.examDate) });
    const gamificationResult = gamificationService.registerMockExam();
    res.status(201).json({ data: { mockExam: toDTO(row), xpEarned: gamificationResult.xpEarned } });
  },

  update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const input = createSchema.partial().parse(req.body);
    const existing = mockExamRepository.findById(id);
    if (!existing) throw HttpError.notFound("Simulado não encontrado");
    const row = mockExamRepository.update(id, {
      ...input,
      examDate: input.examDate ? new Date(input.examDate) : undefined,
    });
    res.json({ data: toDTO(row) });
  },

  delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    const existing = mockExamRepository.findById(id);
    if (!existing) throw HttpError.notFound("Simulado não encontrado");
    mockExamRepository.delete(id);
    res.status(204).send();
  },

  comparison(_req: Request, res: Response) {
    const exams = mockExamRepository.findAll().slice(0, 10).map(toDTO);
    const scored = exams.filter((e) => e.score !== null) as (MockExamDTO & { score: number })[];
    const averageScore = scored.length ? scored.reduce((s, e) => s + e.score, 0) / scored.length : 0;
    const averageAccuracy = exams.length
      ? exams.reduce((s, e) => s + e.correctAnswers / e.totalQuestions, 0) / exams.length
      : 0;

    let trend: MockExamComparisonDTO["trend"] = "estavel";
    if (scored.length >= 2) {
      const chronological = [...scored].reverse();
      const first = chronological[0]!.score;
      const last = chronological[chronological.length - 1]!.score;
      if (last > first) trend = "subindo";
      else if (last < first) trend = "descendo";
    }

    const dto: MockExamComparisonDTO = { exams, averageScore, averageAccuracy, trend };
    res.json({ data: dto });
  },
};
