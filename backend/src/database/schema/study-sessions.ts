import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { subjects, topics } from "./subjects";
import { books, teachers, youtubeChannels } from "./settings";

export const studySessions = sqliteTable("study_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  topicId: integer("topic_id").references(() => topics.id, {
    onDelete: "set null",
  }),
  bookId: integer("book_id").references(() => books.id, {
    onDelete: "set null",
  }),
  youtubeChannelId: integer("youtube_channel_id").references(
    () => youtubeChannels.id,
    { onDelete: "set null" },
  ),
  teacherId: integer("teacher_id").references(() => teachers.id, {
    onDelete: "set null",
  }),
  type: text("type", {
    enum: ["teoria", "exercicios", "revisao", "simulado"],
  }).notNull(),
  startedAt: integer("started_at", { mode: "timestamp" }).notNull(),
  endedAt: integer("ended_at", { mode: "timestamp" }),
  durationSeconds: integer("duration_seconds"),
  exercisesTotal: integer("exercises_total").notNull().default(0),
  exercisesCorrect: integer("exercises_correct").notNull().default(0),
  exercisesWrong: integer("exercises_wrong").notNull().default(0),
  notes: text("notes"),
  xpEarned: integer("xp_earned").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
