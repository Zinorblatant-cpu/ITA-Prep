import { desc, eq } from "drizzle-orm";
import { db } from "../database/client";
import { achievements, userAchievements, userProfile, xpLog } from "../database/schema";

export const gamificationRepository = {
  getProfile() {
    return db.select().from(userProfile).get();
  },

  updateProfile(id: number, data: Partial<typeof userProfile.$inferInsert>) {
    return db
      .update(userProfile)
      .set(data)
      .where(eq(userProfile.id, id))
      .returning()
      .get();
  },

  addXpLog(data: typeof xpLog.$inferInsert) {
    return db.insert(xpLog).values(data).returning().get();
  },

  listXpLog(limit = 50) {
    return db.select().from(xpLog).orderBy(desc(xpLog.createdAt)).limit(limit).all();
  },

  listAchievements() {
    return db.select().from(achievements).all();
  },

  listUnlockedAchievementIds() {
    return db
      .select({ achievementId: userAchievements.achievementId, unlockedAt: userAchievements.unlockedAt })
      .from(userAchievements)
      .all();
  },

  unlockAchievement(achievementId: number) {
    return db.insert(userAchievements).values({ achievementId }).returning().get();
  },
};
