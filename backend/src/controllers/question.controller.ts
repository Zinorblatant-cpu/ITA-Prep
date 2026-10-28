import type { Request, Response } from "express";
import { z } from "zod";
import { questionRepository } from "../repositories/question.repository";
import { HttpError } from "../utils/http-error";
import type { QuestionDTO } from "@ita/shared-types";

function toDTO(row: NonNullable<ReturnType<typeof questionRepository.findById>>): QuestionDTO {
  return {
    id: row.id,
    origin: row.origin,
    year: row.year,
    subjectId: row.subjectId,
    subtopic: row.subtopic,
    timeSpentSeconds: row.timeSpentSeconds,
    isCorrect: row.isCorrect,
    comments: row.comments,
    statementImage: row.statementImage,
    statementText: row.statementText,
    alternatives: row.alternatives,
    correctAlternative: row.correctAlternative,
    resolutionImage: row.resolutionImage,
    resolutionText: row.resolutionText,
    studySessionId: row.studySessionId,
    createdAt: row.createdAt.toISOString(),
  };
}

const alternativeSchema = z.object({
  label: z.string().min(1),
  text: z.string(),
});

const createSchema = z.object({
  origin: z.enum(["ITA", "IME", "AFA", "EsPCEx", "ENEM", "Livro", "Outro"]),
  year: z.number().optional(),
  subjectId: z.number(),
  subtopic: z.string().optional(),
  timeSpentSeconds: z.number().optional(),
  isCorrect: z.boolean(),
  comments: z.string().optional(),
  statementImage: z.string().optional(),
  statementText: z.string().optional(),
  alternatives: z.array(alternativeSchema).optional(),
  correctAlternative: z.string().optional(),
  resolutionImage: z.string().optional(),
  resolutionText: z.string().optional(),
  studySessionId: z.number().optional(),
});

const updateSchema = createSchema.partial();

export const questionController = {
  list(req: Request, res: Response) {
    const { origin, subjectId, year } = req.query;
    const rows = questionRepository.findMany({
      origin: typeof origin === "string" ? origin : undefined,
      subjectId: subjectId ? Number(subjectId) : undefined,
      year: year ? Number(year) : undefined,
    });
    res.json({ data: rows.map(toDTO) });
  },

  create(req: Request, res: Response) {
    const input = createSchema.parse(req.body);
    const row = questionRepository.create(input);
    res.status(201).json({ data: toDTO(row) });
  },

  update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const input = updateSchema.parse(req.body);
    const existing = questionRepository.findById(id);
    if (!existing) throw HttpError.notFound("Questão não encontrada");
    const row = questionRepository.update(id, input);
    res.json({ data: toDTO(row) });
  },

  delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    const existing = questionRepository.findById(id);
    if (!existing) throw HttpError.notFound("Questão não encontrada");
    questionRepository.delete(id);
    res.status(204).send();
  },
};
