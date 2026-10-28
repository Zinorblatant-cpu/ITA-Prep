import { and, eq, gte, isNotNull, lte } from "drizzle-orm";
import { db } from "../database/client";
import { studySessions } from "../database/schema";

export interface StudySessionFilters {
  subjectId?: number;
  type?: string;
  from?: Date;
  to?: Date;
}

function buildFilters(filters: StudySessionFilters) {
  const conditions = [];
  if (filters.subjectId) conditions.push(eq(studySessions.subjectId, filters.subjectId));
  if (filters.type) conditions.push(eq(studySessions.type, filters.type as never));
  if (filters.from) conditions.push(gte(studySessions.startedAt, filters.from));
  if (filters.to) conditions.push(lte(studySessions.startedAt, filters.to));
  return conditions.length ? and(...conditions) : undefined;
}

export const studySessionRepository = {
  findMany(filters: StudySessionFilters = {}) {
    const where = buildFilters(filters);
    const query = db.select().from(studySessions).orderBy(studySessions.startedAt);
    return (where ? query.where(where) : query).all();
  },

  findById(id: number) {
    return db.select().from(studySessions).where(eq(studySessions.id, id)).get();
  },

  start(data: typeof studySessions.$inferInsert) {
    return db.insert(studySessions).values(data).returning().get();
  },

  finish(id: number, data: Partial<typeof studySessions.$inferInsert>) {
    return db
      .update(studySessions)
      .set(data)
      .where(eq(studySessions.id, id))
      .returning()
      .get();
  },

  delete(id: number) {
    return db.delete(studySessions).where(eq(studySessions.id, id)).run();
  },

  findAllFinished() {
    return db
      .select()
      .from(studySessions)
      .where(isNotNull(studySessions.durationSeconds))
      .all();
  },
};
