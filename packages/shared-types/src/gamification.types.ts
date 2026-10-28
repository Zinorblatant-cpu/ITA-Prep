import type { ISODateString } from "./common.types";

export type XpReason =
  | "sessao_estudo"
  | "revisao_concluida"
  | "simulado"
  | "streak_bonus"
  | "conquista";

export interface XpLogEntryDTO {
  id: number;
  amount: number;
  reason: XpReason;
  referenceId: number | null;
  createdAt: ISODateString;
}

export interface UserProfileDTO {
  id: number;
  level: number;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: ISODateString | null;
  xpToNextLevel: number;
  xpForCurrentLevel: number;
}

export type AchievementCriteriaType =
  | "streak"
  | "total_hours"
  | "questions"
  | "mock_exams"
  | "topics_completed";

export interface AchievementDTO {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  criteriaType: AchievementCriteriaType;
  criteriaValue: number;
  unlockedAt: ISODateString | null;
}
