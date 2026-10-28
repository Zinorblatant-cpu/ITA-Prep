import type { ISODateString } from "./common.types";

export interface MockExamSubjectBreakdown {
  subjectId: number;
  correct: number;
  total: number;
}

export interface MockExamDTO {
  id: number;
  examDate: ISODateString;
  name: string;
  totalQuestions: number;
  correctAnswers: number;
  durationSeconds: number;
  score: number | null;
  subjectBreakdown: MockExamSubjectBreakdown[];
  notes: string | null;
  createdAt: ISODateString;
}

export interface CreateMockExamInput {
  examDate: ISODateString;
  name: string;
  totalQuestions: number;
  correctAnswers: number;
  durationSeconds: number;
  score?: number;
  subjectBreakdown?: MockExamSubjectBreakdown[];
  notes?: string;
}

export type UpdateMockExamInput = Partial<CreateMockExamInput>;

export interface MockExamComparisonDTO {
  exams: MockExamDTO[];
  averageScore: number;
  averageAccuracy: number;
  trend: "subindo" | "descendo" | "estavel";
}
