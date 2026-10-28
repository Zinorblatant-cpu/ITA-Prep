import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const goals = sqliteTable("goals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type", { enum: ["diaria", "semanal", "mensal", "anual"] }).notNull(),
  metric: text("metric", {
    enum: ["horas_estudo", "questoes_resolvidas", "revisoes", "simulados"],
  }).notNull(),
  targetValue: real("target_value").notNull(),
  periodStart: integer("period_start", { mode: "timestamp" }).notNull(),
  periodEnd: integer("period_end", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
