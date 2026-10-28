import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "../database/client";
import { reviews } from "../database/schema";

export interface ReviewFilters {
  status?: string;
  from?: Date;
  to?: Date;
}

export const reviewRepository = {
  findMany(filters: ReviewFilters = {}) {
    const conditions = [];
    if (filters.status) conditions.push(eq(reviews.status, filters.status as never));
    if (filters.from) conditions.push(gte(reviews.scheduledDate, filters.from));
    if (filters.to) conditions.push(lte(reviews.scheduledDate, filters.to));
    const where = conditions.length ? and(...conditions) : undefined;
    const query = db.select().from(reviews).orderBy(reviews.scheduledDate);
    return (where ? query.where(where) : query).all();
  },

  findById(id: number) {
    return db.select().from(reviews).where(eq(reviews.id, id)).get();
  },

  findPendingByTopic(topicId: number) {
    return db
      .select()
      .from(reviews)
      .where(and(eq(reviews.topicId, topicId), eq(reviews.status, "pendente")))
      .all();
  },

  createMany(data: (typeof reviews.$inferInsert)[]) {
    return db.insert(reviews).values(data).returning().all();
  },

  update(id: number, data: Partial<typeof reviews.$inferInsert>) {
    return db
      .update(reviews)
      .set(data)
      .where(eq(reviews.id, id))
      .returning()
      .get();
  },
};
