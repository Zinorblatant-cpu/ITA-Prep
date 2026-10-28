import { statisticsService } from "./statistics.service";
import { gamificationRepository } from "../repositories/gamification.repository";
import { reviewRepository } from "../repositories/review.repository";
import { settingsRepository } from "../repositories/settings.repository";
import { daysBetween } from "../utils/date";
import type { DashboardSummaryDTO } from "@ita/shared-types";

const PROGRAM_START_DATE = new Date("2025-01-01");

export const dashboardService = {
  getSummary(): DashboardSummaryDTO {
    const profile = gamificationRepository.getProfile();
    const settings = settingsRepository.getAppSettings();
    const questionsSummary = statisticsService.questionsSummary();
    const today = new Date();
    const examDate = settings?.examDate ?? new Date("2028-12-01");

    const daysUntilExam = Math.max(daysBetween(today, examDate), 0);
    const totalProgramDays = Math.max(daysBetween(PROGRAM_START_DATE, examDate), 1);
    const daysElapsed = Math.max(daysBetween(PROGRAM_START_DATE, today), 0);
    const progressToExamPercentage = Math.min(
      Math.round((daysElapsed / totalProgramDays) * 100),
      100,
    );

    const upcomingReviews = reviewRepository.findMany({ status: "pendente" });

    return {
      hoursToday: round(statisticsService.hoursToday()),
      hoursThisWeek: round(statisticsService.hoursThisWeek()),
      hoursThisMonth: round(statisticsService.hoursThisMonth()),
      hoursTotal: round(statisticsService.hoursTotal()),
      questionsResolved: questionsSummary.total,
      questionsCorrect: questionsSummary.correct,
      accuracyRate: round(questionsSummary.accuracyRate),
      currentStreak: profile?.currentStreak ?? 0,
      longestStreak: profile?.longestStreak ?? 0,
      mockExamsCount: statisticsService.mockExamsCount(),
      daysUntilExam,
      examDate: examDate.toISOString(),
      progressToExamPercentage,
      upcomingReviewsCount: upcomingReviews.length,
      level: profile?.level ?? 1,
      totalXp: profile?.totalXp ?? 0,
    };
  },
};

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
