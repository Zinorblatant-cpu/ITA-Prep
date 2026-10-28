import type { Request, Response } from "express";
import { gamificationRepository } from "../repositories/gamification.repository";
import { xpForLevel } from "../services/gamification.service";
import { HttpError } from "../utils/http-error";
import type { AchievementDTO, UserProfileDTO, XpLogEntryDTO } from "@ita/shared-types";

export const gamificationController = {
  profile(_req: Request, res: Response) {
    const profile = gamificationRepository.getProfile();
    if (!profile) throw HttpError.notFound("Perfil não inicializado");

    const dto: UserProfileDTO = {
      id: profile.id,
      level: profile.level,
      totalXp: profile.totalXp,
      currentStreak: profile.currentStreak,
      longestStreak: profile.longestStreak,
      lastStudyDate: profile.lastStudyDate ? profile.lastStudyDate.toISOString() : null,
      xpForCurrentLevel: xpForLevel(profile.level),
      xpToNextLevel: xpForLevel(profile.level + 1),
    };
    res.json({ data: dto });
  },

  achievements(_req: Request, res: Response) {
    const catalog = gamificationRepository.listAchievements();
    const unlocked = gamificationRepository.listUnlockedAchievementIds();
    const unlockedMap = new Map(unlocked.map((u) => [u.achievementId, u.unlockedAt]));

    const dto: AchievementDTO[] = catalog.map((a) => ({
      id: a.id,
      code: a.code,
      name: a.name,
      description: a.description,
      icon: a.icon,
      xpReward: a.xpReward,
      criteriaType: a.criteriaType,
      criteriaValue: a.criteriaValue,
      unlockedAt: unlockedMap.get(a.id)?.toISOString() ?? null,
    }));
    res.json({ data: dto });
  },

  xpLog(_req: Request, res: Response) {
    const rows = gamificationRepository.listXpLog();
    const dto: XpLogEntryDTO[] = rows.map((r) => ({
      id: r.id,
      amount: r.amount,
      reason: r.reason,
      referenceId: r.referenceId,
      createdAt: r.createdAt.toISOString(),
    }));
    res.json({ data: dto });
  },
};
