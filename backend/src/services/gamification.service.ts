import { gamificationRepository } from "../repositories/gamification.repository";
import { studySessionRepository } from "../repositories/study-session.repository";
import { questionRepository } from "../repositories/question.repository";
import { mockExamRepository } from "../repositories/mock-exam.repository";
import { topicRepository } from "../repositories/topic.repository";
import { isSameDay, daysBetween } from "../utils/date";
import type { XpReason } from "@ita/shared-types";

export const XP_RULES = {
  xpPerStudyMinute: 1,
  maxSessionXp: 180,
  exerciseAccuracyBonus: 20,
  exerciseAccuracyThreshold: 0.8,
  reviewCompleted: 20,
  reviewCompletedGoodBonus: 15,
  mockExamRegistered: 100,
  streakBonusEveryDays: 7,
  streakBonusXp: 50,
};

/** Função pura: calcula o novo streak a partir da última data de estudo. */
export function calculateStreak(
  lastStudyDate: Date | null,
  today: Date,
  currentStreak: number,
): { streak: number; changed: boolean } {
  if (!lastStudyDate) return { streak: 1, changed: true };
  if (isSameDay(lastStudyDate, today)) return { streak: currentStreak, changed: false };

  const diff = daysBetween(lastStudyDate, today);
  if (diff === 1) return { streak: currentStreak + 1, changed: true };
  return { streak: 1, changed: true };
}

/** Função pura: nível derivado do total de XP acumulado (curva raiz quadrada). */
export function xpToLevel(totalXp: number): number {
  return Math.floor(Math.sqrt(totalXp / 100)) + 1;
}

export function xpForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100;
}

export const gamificationService = {
  ensureProfile() {
    const profile = gamificationRepository.getProfile();
    if (!profile) throw new Error("Perfil de usuário não inicializado. Rode o seed.");
    return profile;
  },

  addXp(amount: number, reason: XpReason, referenceId?: number) {
    const profile = this.ensureProfile();
    gamificationRepository.addXpLog({ amount, reason, referenceId });
    const totalXp = profile.totalXp + amount;
    const newLevel = xpToLevel(totalXp);
    const levelUp = newLevel > profile.level;
    gamificationRepository.updateProfile(profile.id, { totalXp, level: newLevel });
    return { totalXp, level: newLevel, levelUp };
  },

  registerStudySession(durationSeconds: number, exercisesTotal: number, exercisesCorrect: number) {
    const profile = this.ensureProfile();
    const today = new Date();
    const { streak, changed } = calculateStreak(profile.lastStudyDate, today, profile.currentStreak);
    const longestStreak = Math.max(profile.longestStreak, streak);
    gamificationRepository.updateProfile(profile.id, {
      currentStreak: streak,
      longestStreak,
      lastStudyDate: today,
    });

    const minutes = durationSeconds / 60;
    let sessionXp = Math.min(Math.round(minutes * XP_RULES.xpPerStudyMinute), XP_RULES.maxSessionXp);
    if (exercisesTotal > 0 && exercisesCorrect / exercisesTotal >= XP_RULES.exerciseAccuracyThreshold) {
      sessionXp += XP_RULES.exerciseAccuracyBonus;
    }

    let result = this.addXp(sessionXp, "sessao_estudo");
    let totalXpEarned = sessionXp;

    const streakBonusApplies = changed && streak > 0 && streak % XP_RULES.streakBonusEveryDays === 0;
    if (streakBonusApplies) {
      result = this.addXp(XP_RULES.streakBonusXp, "streak_bonus");
      totalXpEarned += XP_RULES.streakBonusXp;
    }

    this.checkAchievements();
    return {
      ...result,
      currentStreak: streak,
      streakChanged: changed,
      xpEarned: totalXpEarned,
    };
  },

  registerReviewCompleted(performanceRating: "ruim" | "medio" | "bom") {
    let xp = XP_RULES.reviewCompleted;
    if (performanceRating === "bom") xp += XP_RULES.reviewCompletedGoodBonus;
    const result = this.addXp(xp, "revisao_concluida");
    this.checkAchievements();
    return { ...result, xpEarned: xp };
  },

  registerMockExam() {
    const result = this.addXp(XP_RULES.mockExamRegistered, "simulado");
    this.checkAchievements();
    return { ...result, xpEarned: XP_RULES.mockExamRegistered };
  },

  checkAchievements() {
    const profile = this.ensureProfile();
    const catalog = gamificationRepository.listAchievements();
    const unlockedIds = new Set(
      gamificationRepository.listUnlockedAchievementIds().map((row) => row.achievementId),
    );

    for (const achievement of catalog) {
      if (unlockedIds.has(achievement.id)) continue;
      const value = this.getCriteriaValue(achievement.criteriaType, profile);
      if (value >= achievement.criteriaValue) {
        gamificationRepository.unlockAchievement(achievement.id);
        this.addXp(achievement.xpReward, "conquista", achievement.id);
      }
    }
  },

  getCriteriaValue(
    criteriaType: "streak" | "total_hours" | "questions" | "mock_exams" | "topics_completed",
    profile: { currentStreak: number; longestStreak: number },
  ): number {
    switch (criteriaType) {
      case "streak":
        return Math.max(profile.currentStreak, profile.longestStreak);
      case "total_hours": {
        const totalSeconds = studySessionRepository
          .findAllFinished()
          .reduce((sum, s) => sum + (s.durationSeconds ?? 0), 0);
        return totalSeconds / 3600;
      }
      case "questions":
        return questionRepository.findAll().length;
      case "mock_exams":
        return mockExamRepository.findAll().length;
      case "topics_completed":
        return topicRepository.findAllCompleted().length;
      default:
        return 0;
    }
  },
};
