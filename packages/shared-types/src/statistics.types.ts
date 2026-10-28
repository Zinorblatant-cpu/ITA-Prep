import type { ISODateString } from "./common.types";

export interface HoursByPeriodPointDTO {
  periodLabel: string;
  periodStart: ISODateString;
  hours: number;
}

export interface QuestionsStatsDTO {
  periodLabel: string;
  periodStart: ISODateString;
  total: number;
  correct: number;
}

export interface AccuracyBySubjectDTO {
  subjectId: number;
  subjectName: string;
  color: string;
  totalQuestions: number;
  correctQuestions: number;
  accuracyRate: number;
}

export interface HeatmapDayDTO {
  date: ISODateString;
  hours: number;
  sessionsCount: number;
}

export interface TopicStrengthDTO {
  topicId: number;
  topicName: string;
  subjectName: string;
  accuracyRate: number;
  totalQuestions: number;
}

export interface WeakStrongTopicsDTO {
  weakest: TopicStrengthDTO[];
  strongest: TopicStrengthDTO[];
}

export interface DashboardSummaryDTO {
  hoursToday: number;
  hoursThisWeek: number;
  hoursThisMonth: number;
  hoursTotal: number;
  questionsResolved: number;
  questionsCorrect: number;
  accuracyRate: number;
  currentStreak: number;
  longestStreak: number;
  mockExamsCount: number;
  daysUntilExam: number;
  examDate: ISODateString;
  progressToExamPercentage: number;
  upcomingReviewsCount: number;
  level: number;
  totalXp: number;
}
