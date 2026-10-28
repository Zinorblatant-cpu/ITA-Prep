import type { ISODateString } from "./common.types";

export type ErrorType = "distracao" | "conceito" | "calculo" | "interpretacao";
export type ErrorStatus = "pendente" | "revisado" | "dominado";

export interface ErrorNotebookEntryDTO {
  id: number;
  subjectId: number;
  topicId: number | null;
  questionText: string;
  source: string | null;
  errorType: ErrorType;
  correction: string | null;
  imageUrl: string | null;
  status: ErrorStatus;
  studySessionId: number | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateErrorNotebookEntryInput {
  subjectId: number;
  topicId?: number;
  questionText: string;
  source?: string;
  errorType: ErrorType;
  correction?: string;
  imageUrl?: string;
  studySessionId?: number;
}

export type UpdateErrorNotebookEntryInput = Partial<CreateErrorNotebookEntryInput> & {
  status?: ErrorStatus;
};
