import type { ISODateString } from "./common.types";

export type ReviewInterval = 1 | 7 | 30 | 90 | 180;
export type ReviewStatus = "pendente" | "concluida" | "atrasada" | "pulada";
export type ReviewPerformance = "ruim" | "medio" | "bom";

export interface ReviewDTO {
  id: number;
  topicId: number;
  topicName: string;
  subjectId: number;
  subjectName: string;
  originSessionId: number | null;
  scheduledDate: ISODateString;
  intervalDays: ReviewInterval;
  status: ReviewStatus;
  completedAt: ISODateString | null;
  performanceRating: ReviewPerformance | null;
  notes: string | null;
  createdAt: ISODateString;
}

export interface CompleteReviewInput {
  performanceRating: ReviewPerformance;
  notes?: string;
}
