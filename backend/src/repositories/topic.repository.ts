import { and, eq, ne } from "drizzle-orm";
import { db } from "../database/client";
import { topics } from "../database/schema";

export const topicRepository = {
  findBySubject(subjectId: number) {
    return db
      .select()
      .from(topics)
      .where(eq(topics.subjectId, subjectId))
      .orderBy(topics.orderIndex)
      .all();
  },

  findById(id: number) {
    return db.select().from(topics).where(eq(topics.id, id)).get();
  },

  create(data: typeof topics.$inferInsert) {
    return db.insert(topics).values(data).returning().get();
  },

  update(id: number, data: Partial<typeof topics.$inferInsert>) {
    return db
      .update(topics)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(topics.id, id))
      .returning()
      .get();
  },

  delete(id: number) {
    return db.delete(topics).where(eq(topics.id, id)).run();
  },

  findAllCompleted() {
    return db
      .select()
      .from(topics)
      .where(and(eq(topics.status, "concluido")))
      .all();
  },

  findAll() {
    return db.select().from(topics).orderBy(topics.subjectId, topics.orderIndex).all();
  },

  findPending(subjectId?: number) {
    const conditions = [ne(topics.status, "concluido")];
    if (subjectId) conditions.push(eq(topics.subjectId, subjectId));
    return db
      .select()
      .from(topics)
      .where(and(...conditions))
      .orderBy(topics.orderIndex)
      .all();
  },
};
