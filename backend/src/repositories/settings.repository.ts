import { eq } from "drizzle-orm";
import { db } from "../database/client";
import { appSettings, books, courses, teachers, youtubeChannels } from "../database/schema";

export const settingsRepository = {
  listBooks() {
    return db.select().from(books).all();
  },
  createBook(data: typeof books.$inferInsert) {
    return db.insert(books).values(data).returning().get();
  },
  updateBook(id: number, data: Partial<typeof books.$inferInsert>) {
    return db.update(books).set(data).where(eq(books.id, id)).returning().get();
  },
  deleteBook(id: number) {
    return db.delete(books).where(eq(books.id, id)).run();
  },

  listCourses() {
    return db.select().from(courses).all();
  },
  createCourse(data: typeof courses.$inferInsert) {
    return db.insert(courses).values(data).returning().get();
  },
  updateCourse(id: number, data: Partial<typeof courses.$inferInsert>) {
    return db.update(courses).set(data).where(eq(courses.id, id)).returning().get();
  },
  deleteCourse(id: number) {
    return db.delete(courses).where(eq(courses.id, id)).run();
  },

  listYoutubeChannels() {
    return db.select().from(youtubeChannels).all();
  },
  getYoutubeChannelById(id: number) {
    return db.select().from(youtubeChannels).where(eq(youtubeChannels.id, id)).get();
  },
  createYoutubeChannel(data: typeof youtubeChannels.$inferInsert) {
    return db.insert(youtubeChannels).values(data).returning().get();
  },
  updateYoutubeChannel(id: number, data: Partial<typeof youtubeChannels.$inferInsert>) {
    return db
      .update(youtubeChannels)
      .set(data)
      .where(eq(youtubeChannels.id, id))
      .returning()
      .get();
  },
  deleteYoutubeChannel(id: number) {
    return db.delete(youtubeChannels).where(eq(youtubeChannels.id, id)).run();
  },

  listTeachers() {
    return db.select().from(teachers).all();
  },
  createTeacher(data: typeof teachers.$inferInsert) {
    return db.insert(teachers).values(data).returning().get();
  },
  updateTeacher(id: number, data: Partial<typeof teachers.$inferInsert>) {
    return db.update(teachers).set(data).where(eq(teachers.id, id)).returning().get();
  },
  deleteTeacher(id: number) {
    return db.delete(teachers).where(eq(teachers.id, id)).run();
  },

  getAppSettings() {
    return db.select().from(appSettings).get();
  },
  updateAppSettings(id: number, data: Partial<typeof appSettings.$inferInsert>) {
    return db
      .update(appSettings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(appSettings.id, id))
      .returning()
      .get();
  },
};
