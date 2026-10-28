import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { topics } from "./subjects";
import { studySessions } from "./study-sessions";

export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  topicId: integer("topic_id")
    .notNull()
    .references(() => topics.id, { onDelete: "cascade" }),
  originSessionId: integer("origin_session_id").references(
    () => studySessions.id,
    { onDelete: "set null" },
  ),
  scheduledDate: integer("scheduled_date", { mode: "timestamp" }).notNull(),
  // Valores possíveis: 1, 7, 30, 90, 180 dias (validado na camada de aplicação, ver shared-types ReviewInterval)
  intervalDays: integer("interval_days").notNull(),
  status: text("status", {
    enum: ["pendente", "concluida", "atrasada", "pulada"],
  })
    .notNull()
    .default("pendente"),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  performanceRating: text("performance_rating", {
    enum: ["ruim", "medio", "bom"],
  }),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
