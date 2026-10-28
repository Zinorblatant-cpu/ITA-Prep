import type { Request, Response } from "express";
import { statisticsService } from "../services/statistics.service";

function parseGroupBy(req: Request): "week" | "month" {
  return req.query.groupBy === "month" ? "month" : "week";
}

export const statisticsController = {
  hours(req: Request, res: Response) {
    res.json({ data: statisticsService.hoursByPeriod(parseGroupBy(req)) });
  },
  questions(req: Request, res: Response) {
    res.json({ data: statisticsService.questionsByPeriod(parseGroupBy(req)) });
  },
  accuracyBySubject(_req: Request, res: Response) {
    res.json({ data: statisticsService.accuracyBySubject() });
  },
  heatmap(req: Request, res: Response) {
    const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();
    res.json({ data: statisticsService.heatmap(year) });
  },
  weakStrongTopics(_req: Request, res: Response) {
    res.json({ data: statisticsService.weakStrongTopics() });
  },
};
