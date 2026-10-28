import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "./client";

migrate(db, { migrationsFolder: "./src/database/migrations" });
console.log("Migrations aplicadas com sucesso.");
