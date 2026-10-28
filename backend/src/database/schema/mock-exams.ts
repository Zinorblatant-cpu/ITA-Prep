import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const mockExams = sqliteTable("mock_exams", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  examDate: integer("exam_date", { mode: "timestamp" }).notNull(),
  name: text("name").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  durationSeconds: integer("duration_seconds").notNull(),
  score: real("score"),
  // Array de { subjectId, correct, total } por disciplina
  subjectBreakdown: text("subject_breakdown", { mode: "json" }).$type<
    { subjectId: number; correct: number; total: number }[]
  >(),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
