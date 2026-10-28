import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { subjects } from "./subjects";

export const books = sqliteTable("books", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  author: text("author"),
  subjectId: integer("subject_id").references(() => subjects.id, {
    onDelete: "set null",
  }),
  totalPages: integer("total_pages"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const courses = sqliteTable("courses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  platform: text("platform"),
  url: text("url"),
  subjectId: integer("subject_id").references(() => subjects.id, {
    onDelete: "set null",
  }),
  notes: text("notes"),
});

export const youtubeChannels = sqliteTable("youtube_channels", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  url: text("url"),
  subjectId: integer("subject_id").references(() => subjects.id, {
    onDelete: "set null",
  }),
});

export const teachers = sqliteTable("teachers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  subjectId: integer("subject_id").references(() => subjects.id, {
    onDelete: "set null",
  }),
  notes: text("notes"),
});

export const appSettings = sqliteTable("app_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  weeklyHourTarget: real("weekly_hour_target").notNull().default(18),
  examDate: integer("exam_date", { mode: "timestamp" }).notNull(),
  themePreference: text("theme_preference", {
    enum: ["light", "dark", "system"],
  })
    .notNull()
    .default("system"),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
