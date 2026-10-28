import { desc, eq } from "drizzle-orm";
import { db } from "../database/client";
import { mockExams } from "../database/schema";

export const mockExamRepository = {
  findAll() {
    return db.select().from(mockExams).orderBy(desc(mockExams.examDate)).all();
  },

  findById(id: number) {
    return db.select().from(mockExams).where(eq(mockExams.id, id)).get();
  },

  create(data: typeof mockExams.$inferInsert) {
    return db.insert(mockExams).values(data).returning().get();
  },

  update(id: number, data: Partial<typeof mockExams.$inferInsert>) {
    return db
      .update(mockExams)
      .set(data)
      .where(eq(mockExams.id, id))
      .returning()
      .get();
  },

  delete(id: number) {
    return db.delete(mockExams).where(eq(mockExams.id, id)).run();
  },
};
