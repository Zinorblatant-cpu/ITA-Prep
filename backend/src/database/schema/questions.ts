import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { subjects } from "./subjects";
import { studySessions } from "./study-sessions";

export interface QuestionAlternative {
  label: string;
  text: string;
}

export const questions = sqliteTable("questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  origin: text("origin", {
    enum: ["ITA", "IME", "AFA", "EsPCEx", "ENEM", "Livro", "Outro"],
  }).notNull(),
  year: integer("year"),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  subtopic: text("subtopic"),
  timeSpentSeconds: integer("time_spent_seconds"),
  isCorrect: integer("is_correct", { mode: "boolean" }).notNull(),
  comments: text("comments"),
  statementImage: text("statement_image"),
  statementText: text("statement_text"),
  alternatives: text("alternatives", { mode: "json" }).$type<QuestionAlternative[]>(),
  correctAlternative: text("correct_alternative"),
  resolutionImage: text("resolution_image"),
  resolutionText: text("resolution_text"),
  studySessionId: integer("study_session_id").references(
    () => studySessions.id,
    { onDelete: "set null" },
  ),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
