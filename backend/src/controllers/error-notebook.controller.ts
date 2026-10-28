import type { Request, Response } from "express";
import { z } from "zod";
import { errorNotebookRepository } from "../repositories/error-notebook.repository";
import { HttpError } from "../utils/http-error";
import type { ErrorNotebookEntryDTO } from "@ita/shared-types";

function toDTO(
  row: NonNullable<ReturnType<typeof errorNotebookRepository.findById>>,
): ErrorNotebookEntryDTO {
  return {
    id: row.id,
    subjectId: row.subjectId,
    topicId: row.topicId,
    questionText: row.questionText,
    source: row.source,
    errorType: row.errorType,
    correction: row.correction,
    imageUrl: row.imageUrl,
    status: row.status,
    studySessionId: row.studySessionId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

const createSchema = z.object({
  subjectId: z.number(),
  topicId: z.number().optional(),
  questionText: z.string().min(1),
  source: z.string().optional(),
  errorType: z.enum(["distracao", "conceito", "calculo", "interpretacao"]),
  correction: z.string().optional(),
  imageUrl: z.string().optional(),
  studySessionId: z.number().optional(),
});

const updateSchema = createSchema.partial().extend({
  status: z.enum(["pendente", "revisado", "dominado"]).optional(),
});

export const errorNotebookController = {
  list(req: Request, res: Response) {
    const { status, subjectId } = req.query;
    const rows = errorNotebookRepository.findMany({
      status: typeof status === "string" ? status : undefined,
      subjectId: subjectId ? Number(subjectId) : undefined,
    });
    res.json({ data: rows.map(toDTO) });
  },

  getById(req: Request, res: Response) {
    const row = errorNotebookRepository.findById(Number(req.params.id));
    if (!row) throw HttpError.notFound("Registro não encontrado");
    res.json({ data: toDTO(row) });
  },

  create(req: Request, res: Response) {
    const input = createSchema.parse(req.body);
    const row = errorNotebookRepository.create({ ...input, status: "pendente" });
    res.status(201).json({ data: toDTO(row) });
  },

  update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const input = updateSchema.parse(req.body);
    const existing = errorNotebookRepository.findById(id);
    if (!existing) throw HttpError.notFound("Registro não encontrado");
    const row = errorNotebookRepository.update(id, input);
    res.json({ data: toDTO(row) });
  },

  delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    const existing = errorNotebookRepository.findById(id);
    if (!existing) throw HttpError.notFound("Registro não encontrado");
    errorNotebookRepository.delete(id);
    res.status(204).send();
  },
};
