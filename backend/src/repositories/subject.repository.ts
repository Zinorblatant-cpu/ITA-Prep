import { eq } from "drizzle-orm";
import { db } from "../database/client";
import { subjects } from "../database/schema";

export const subjectRepository = {
  findAll() {
    return db.select().from(subjects).orderBy(subjects.id).all();
  },

  findById(id: number) {
    return db.select().from(subjects).where(eq(subjects.id, id)).get();
  },

  update(id: number, data: Partial<typeof subjects.$inferInsert>) {
    return db
      .update(subjects)
      .set(data)
      .where(eq(subjects.id, id))
      .returning()
      .get();
  },
};
