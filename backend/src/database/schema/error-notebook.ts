import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { subjects, topics } from "./subjects";
import { studySessions } from "./study-sessions";

export const errorNotebookEntries = sqliteTable("error_notebook_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  topicId: integer("topic_id").references(() => topics.id, {
    onDelete: "set null",
  }),
  questionText: text("question_text").notNull(),
  source: text("source"),
  errorType: text("error_type", {
    enum: ["distracao", "conceito", "calculo", "interpretacao"],
  }).notNull(),
  correction: text("correction"),
  imageUrl: text("image_url"),
  status: text("status", { enum: ["pendente", "revisado", "dominado"] })
    .notNull()
    .default("pendente"),
  studySessionId: integer("study_session_id").references(
    () => studySessions.id,
    { onDelete: "set null" },
  ),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
