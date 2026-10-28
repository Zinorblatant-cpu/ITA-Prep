import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandlerMiddleware } from "./middlewares/error-handler";
import { notFoundMiddleware } from "./middlewares/not-found";
import { apiRouter } from "./routes";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: "25mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ data: { status: "ok" } });
  });

  app.use("/api", apiRouter);

  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
}
