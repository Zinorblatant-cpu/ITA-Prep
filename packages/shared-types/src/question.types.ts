import type { ISODateString } from "./common.types";

export type QuestionOrigin = "ITA" | "IME" | "AFA" | "EsPCEx" | "ENEM" | "Livro" | "Outro";

export interface QuestionAlternative {
  label: string;
  text: string;
}

export interface QuestionDTO {
  id: number;
  origin: QuestionOrigin;
  year: number | null;
  subjectId: number;
  subtopic: string | null;
  timeSpentSeconds: number | null;
  isCorrect: boolean;
  comments: string | null;
  statementImage: string | null;
  statementText: string | null;
  alternatives: QuestionAlternative[] | null;
  correctAlternative: string | null;
  resolutionImage: string | null;
  resolutionText: string | null;
  studySessionId: number | null;
  createdAt: ISODateString;
}

export interface CreateQuestionInput {
  origin: QuestionOrigin;
  year?: number;
  subjectId: number;
  subtopic?: string;
  timeSpentSeconds?: number;
  isCorrect: boolean;
  comments?: string;
  statementImage?: string;
  statementText?: string;
  alternatives?: QuestionAlternative[];
  correctAlternative?: string;
  resolutionImage?: string;
  resolutionText?: string;
  studySessionId?: number;
}

export type UpdateQuestionInput = Partial<CreateQuestionInput>;
