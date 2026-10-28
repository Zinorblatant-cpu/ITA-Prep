import type { Request, Response } from "express";
import { db } from "../database/client";
import { goals, mockExams, reviews, studySessions } from "../database/schema";
import { HttpError } from "../utils/http-error";
import type { CalendarDayDTO, CalendarMonthDTO } from "@ita/shared-types";

export const calendarController = {
  month(req: Request, res: Response) {
    const year = Number(req.query.year);
    const month = Number(req.query.month); // 1-12
    if (!year || !month) throw HttpError.badRequest("year e month são obrigatórios");

    const from = new Date(year, month - 1, 1);
    const to = new Date(year, month, 0, 23, 59, 59);

    const sessions = db.select().from(studySessions).all().filter(
      (s) => s.startedAt >= from && s.startedAt <= to,
    );
    const monthReviews = db.select().from(reviews).all().filter(
      (r) => r.scheduledDate >= from && r.scheduledDate <= to,
    );
    const monthMockExams = db.select().from(mockExams).all().filter(
      (m) => m.examDate >= from && m.examDate <= to,
    );
    const monthGoals = db.select().from(goals).all().filter(
      (g) => g.periodStart <= to && g.periodEnd >= from,
    );

    const daysInMonth = to.getDate();
    const days: CalendarDayDTO[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dayStart = new Date(year, month - 1, d);
      const dayEnd = new Date(year, month - 1, d, 23, 59, 59);

      const daySessions = sessions.filter((s) => s.startedAt >= dayStart && s.startedAt <= dayEnd);
      const hours = daySessions.reduce((sum, s) => sum + (s.durationSeconds ?? 0), 0) / 3600;
      const dayReviews = monthReviews.filter((r) => r.scheduledDate >= dayStart && r.scheduledDate <= dayEnd);
      const dayMockExams = monthMockExams.filter((m) => m.examDate >= dayStart && m.examDate <= dayEnd);
      const dayGoalsAchieved = monthGoals.filter(
        (g) => g.periodEnd >= dayStart && g.periodEnd <= dayEnd,
      );

      days.push({
        date: dayStart.toISOString(),
        studied: daySessions.length > 0,
        hours: Math.round(hours * 100) / 100,
        reviewsCount: dayReviews.length,
        mockExamsCount: dayMockExams.length,
        goalsAchievedCount: dayGoalsAchieved.length,
      });
    }

    const dto: CalendarMonthDTO = { year, month, days };
    res.json({ data: dto });
  },
};
