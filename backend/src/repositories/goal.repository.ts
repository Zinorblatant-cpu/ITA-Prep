import { eq } from "drizzle-orm";
import { db } from "../database/client";
import { goals } from "../database/schema";

export const goalRepository = {
  findMany(type?: string) {
    const query = db.select().from(goals).orderBy(goals.periodStart);
    return (type ? query.where(eq(goals.type, type as never)) : query).all();
  },

  findById(id: number) {
    return db.select().from(goals).where(eq(goals.id, id)).get();
  },

  create(data: typeof goals.$inferInsert) {
    return db.insert(goals).values(data).returning().get();
  },

  delete(id: number) {
    return db.delete(goals).where(eq(goals.id, id)).run();
  },
};
