import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 3333),
  databaseUrl: process.env.DATABASE_URL ?? "./data/ita.sqlite",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
};
