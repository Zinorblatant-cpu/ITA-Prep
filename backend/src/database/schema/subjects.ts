import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const subjects = sqliteTable("subjects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug", {
    enum: ["matematica", "fisica", "quimica", "portugues", "ingles"],
  })
    .notNull()
    .unique(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
  targetPercentage: real("target_percentage").notNull().default(100),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const topics = sqliteTable("topics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull().default(0),
  difficulty: text("difficulty", { enum: ["facil", "medio", "dificil"] }),
  priority: text("priority", { enum: ["baixa", "media", "alta"] }),
  progressPercentage: real("progress_percentage").notNull().default(0),
  status: text("status", {
    enum: ["nao_iniciado", "em_andamento", "concluido", "revisao"],
  })
    .notNull()
    .default("nao_iniciado"),
  startedAt: integer("started_at", { mode: "timestamp" }),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
