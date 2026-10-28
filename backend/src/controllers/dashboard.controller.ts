import type { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service";

export const dashboardController = {
  summary(_req: Request, res: Response) {
    res.json({ data: dashboardService.getSummary() });
  },
};
