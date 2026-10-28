import { and, eq } from "drizzle-orm";
import { db } from "../database/client";
import { errorNotebookEntries } from "../database/schema";

export interface ErrorNotebookFilters {
  status?: string;
  subjectId?: number;
}

export const errorNotebookRepository = {
  findMany(filters: ErrorNotebookFilters = {}) {
    const conditions = [];
    if (filters.status) conditions.push(eq(errorNotebookEntries.status, filters.status as never));
    if (filters.subjectId) conditions.push(eq(errorNotebookEntries.subjectId, filters.subjectId));
    const where = conditions.length ? and(...conditions) : undefined;
    const query = db.select().from(errorNotebookEntries).orderBy(errorNotebookEntries.createdAt);
    return (where ? query.where(where) : query).all();
  },

  findById(id: number) {
    return db
      .select()
      .from(errorNotebookEntries)
      .where(eq(errorNotebookEntries.id, id))
      .get();
  },

  create(data: typeof errorNotebookEntries.$inferInsert) {
    return db.insert(errorNotebookEntries).values(data).returning().get();
  },

  update(id: number, data: Partial<typeof errorNotebookEntries.$inferInsert>) {
    return db
      .update(errorNotebookEntries)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(errorNotebookEntries.id, id))
      .returning()
      .get();
  },

  delete(id: number) {
    return db.delete(errorNotebookEntries).where(eq(errorNotebookEntries.id, id)).run();
  },
};
