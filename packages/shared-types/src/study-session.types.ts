import type { ISODateString } from "./common.types";

export type StudySessionType = "teoria" | "exercicios" | "revisao" | "simulado";

export interface StudySessionDTO {
  id: number;
  subjectId: number;
  topicId: number | null;
  bookId: number | null;
  youtubeChannelId: number | null;
  teacherId: number | null;
  type: StudySessionType;
  startedAt: ISODateString;
  endedAt: ISODateString | null;
  durationSeconds: number | null;
  exercisesTotal: number;
  exercisesCorrect: number;
  exercisesWrong: number;
  notes: string | null;
  xpEarned: number;
  createdAt: ISODateString;
}

export interface StartStudySessionInput {
  subjectId: number;
  topicId?: number;
  bookId?: number;
  youtubeChannelId?: number;
  teacherId?: number;
  type: StudySessionType;
}

export interface FinishStudySessionInput {
  exercisesTotal?: number;
  exercisesCorrect?: number;
  exercisesWrong?: number;
  notes?: string;
  endedAt?: ISODateString;
}

export interface FinishStudySessionResultDTO {
  session: StudySessionDTO;
  xpEarned: number;
  currentStreak: number;
  streakChanged: boolean;
  levelUp: boolean;
  newLevel: number;
}
