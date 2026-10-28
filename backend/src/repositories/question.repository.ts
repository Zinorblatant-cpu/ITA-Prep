import { and, eq } from "drizzle-orm";
import { db } from "../database/client";
import { questions } from "../database/schema";

export interface QuestionFilters {
  origin?: string;
  subjectId?: number;
  year?: number;
}

export const questionRepository = {
  findMany(filters: QuestionFilters = {}) {
    const conditions = [];
    if (filters.origin) conditions.push(eq(questions.origin, filters.origin as never));
    if (filters.subjectId) conditions.push(eq(questions.subjectId, filters.subjectId));
    if (filters.year) conditions.push(eq(questions.year, filters.year));
    const where = conditions.length ? and(...conditions) : undefined;
    const query = db.select().from(questions).orderBy(questions.createdAt);
    return (where ? query.where(where) : query).all();
  },

  findById(id: number) {
    return db.select().from(questions).where(eq(questions.id, id)).get();
  },

  create(data: typeof questions.$inferInsert) {
    return db.insert(questions).values(data).returning().get();
  },

  update(id: number, data: Partial<typeof questions.$inferInsert>) {
    return db
      .update(questions)
      .set(data)
      .where(eq(questions.id, id))
      .returning()
      .get();
  },

  delete(id: number) {
    return db.delete(questions).where(eq(questions.id, id)).run();
  },

  findAll() {
    return db.select().from(questions).all();
  },
};
