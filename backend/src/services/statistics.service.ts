import { db } from "../database/client";
import { mockExams, questions, studySessions, subjects, topics } from "../database/schema";
import { and, eq, gte } from "drizzle-orm";
import { startOfDay, startOfMonth, startOfWeek } from "../utils/date";
import type {
  AccuracyBySubjectDTO,
  HeatmapDayDTO,
  HoursByPeriodPointDTO,
  QuestionsStatsDTO,
  SubjectStatsDTO,
  TopicStrengthDTO,
  WeakStrongTopicsDTO,
} from "@ita/shared-types";

function sumHoursSince(since: Date): number {
  const rows = db
    .select({ durationSeconds: studySessions.durationSeconds })
    .from(studySessions)
    .where(gte(studySessions.startedAt, since))
    .all();
  const totalSeconds = rows.reduce((sum, r) => sum + (r.durationSeconds ?? 0), 0);
  return totalSeconds / 3600;
}

export const statisticsService = {
  subjectStats(subjectId: number): SubjectStatsDTO {
    const subjectTopics = db.select().from(topics).where(eq(topics.subjectId, subjectId)).all();
    const completedTopics = subjectTopics.filter((t) => t.status === "concluido").length;
    const progressPercentage =
      subjectTopics.length > 0
        ? subjectTopics.reduce((sum, t) => sum + t.progressPercentage, 0) / subjectTopics.length
        : 0;

    const sessions = db
      .select({ durationSeconds: studySessions.durationSeconds, exercisesTotal: studySessions.exercisesTotal, exercisesCorrect: studySessions.exercisesCorrect })
      .from(studySessions)
      .where(eq(studySessions.subjectId, subjectId))
      .all();
    const totalSeconds = sessions.reduce((sum, s) => sum + (s.durationSeconds ?? 0), 0);
    const totalExercises = sessions.reduce((sum, s) => sum + s.exercisesTotal, 0);
    const correctExercises = sessions.reduce((sum, s) => sum + s.exercisesCorrect, 0);

    return {
      subjectId,
      totalTopics: subjectTopics.length,
      completedTopics,
      progressPercentage: Math.round(progressPercentage * 100) / 100,
      totalHours: Math.round((totalSeconds / 3600) * 100) / 100,
      totalExercises,
      correctExercises,
      accuracyRate: totalExercises > 0 ? correctExercises / totalExercises : 0,
    };
  },

  hoursToday() {
    return sumHoursSince(startOfDay(new Date()));
  },
  hoursThisWeek() {
    return sumHoursSince(startOfWeek(new Date()));
  },
  hoursThisMonth() {
    return sumHoursSince(startOfMonth(new Date()));
  },
  hoursTotal() {
    return sumHoursSince(new Date(0));
  },

  questionsSummary() {
    const rows = db.select({ isCorrect: questions.isCorrect }).from(questions).all();
    const total = rows.length;
    const correct = rows.filter((r) => r.isCorrect).length;
    const accuracyRate = total > 0 ? correct / total : 0;
    return { total, correct, accuracyRate };
  },

  mockExamsCount() {
    return db.select({ id: mockExams.id }).from(mockExams).all().length;
  },

  hoursByPeriod(groupBy: "week" | "month"): HoursByPeriodPointDTO[] {
    const allSessions = db
      .select({ startedAt: studySessions.startedAt, durationSeconds: studySessions.durationSeconds })
      .from(studySessions)
      .all();

    const buckets = new Map<string, { start: Date; hours: number }>();
    for (const session of allSessions) {
      const bucketStart = groupBy === "week" ? startOfWeek(session.startedAt) : startOfMonth(session.startedAt);
      const key = bucketStart.toISOString();
      const existing = buckets.get(key) ?? { start: bucketStart, hours: 0 };
      existing.hours += (session.durationSeconds ?? 0) / 3600;
      buckets.set(key, existing);
    }

    return [...buckets.entries()]
      .sort((a, b) => a[1].start.getTime() - b[1].start.getTime())
      .map(([key, value]) => ({
        periodLabel: key.slice(0, 10),
        periodStart: value.start.toISOString(),
        hours: Math.round(value.hours * 100) / 100,
      }));
  },

  questionsByPeriod(groupBy: "week" | "month"): QuestionsStatsDTO[] {
    const allQuestions = db
      .select({ createdAt: questions.createdAt, isCorrect: questions.isCorrect })
      .from(questions)
      .all();

    const buckets = new Map<string, { start: Date; total: number; correct: number }>();
    for (const q of allQuestions) {
      const bucketStart = groupBy === "week" ? startOfWeek(q.createdAt) : startOfMonth(q.createdAt);
      const key = bucketStart.toISOString();
      const existing = buckets.get(key) ?? { start: bucketStart, total: 0, correct: 0 };
      existing.total += 1;
      if (q.isCorrect) existing.correct += 1;
      buckets.set(key, existing);
    }

    return [...buckets.entries()]
      .sort((a, b) => a[1].start.getTime() - b[1].start.getTime())
      .map(([key, value]) => ({
        periodLabel: key.slice(0, 10),
        periodStart: value.start.toISOString(),
        total: value.total,
        correct: value.correct,
      }));
  },

  accuracyBySubject(): AccuracyBySubjectDTO[] {
    const allSubjects = db.select().from(subjects).all();
    const allQuestions = db.select().from(questions).all();

    return allSubjects.map((subject) => {
      const subjectQuestions = allQuestions.filter((q) => q.subjectId === subject.id);
      const correctQuestions = subjectQuestions.filter((q) => q.isCorrect).length;
      return {
        subjectId: subject.id,
        subjectName: subject.name,
        color: subject.color,
        totalQuestions: subjectQuestions.length,
        correctQuestions,
        accuracyRate: subjectQuestions.length > 0 ? correctQuestions / subjectQuestions.length : 0,
      };
    });
  },

  heatmap(year: number): HeatmapDayDTO[] {
    const from = new Date(year, 0, 1);
    const to = new Date(year, 11, 31, 23, 59, 59);
    const allSessions = db
      .select({ startedAt: studySessions.startedAt, durationSeconds: studySessions.durationSeconds })
      .from(studySessions)
      .where(and(gte(studySessions.startedAt, from)))
      .all()
      .filter((s) => s.startedAt <= to);

    const days = new Map<string, { hours: number; sessionsCount: number }>();
    for (const session of allSessions) {
      const key = startOfDay(session.startedAt).toISOString().slice(0, 10);
      const existing = days.get(key) ?? { hours: 0, sessionsCount: 0 };
      existing.hours += (session.durationSeconds ?? 0) / 3600;
      existing.sessionsCount += 1;
      days.set(key, existing);
    }

    return [...days.entries()].map(([date, value]) => ({
      date,
      hours: Math.round(value.hours * 100) / 100,
      sessionsCount: value.sessionsCount,
    }));
  },

  weakStrongTopics(limit = 5): WeakStrongTopicsDTO {
    const allTopics = db
      .select({ id: topics.id, name: topics.name, subjectId: topics.subjectId })
      .from(topics)
      .all();
    const allSubjects = db.select().from(subjects).all();
    const allQuestions = db.select().from(questions).all();

    // Questões não têm topicId direto; aproximamos via subtopic == nome do tópico (registro livre pelo usuário).
    const strengths: TopicStrengthDTO[] = allTopics
      .map((topic) => {
        const subject = allSubjects.find((s) => s.id === topic.subjectId);
        const related = allQuestions.filter((q) => q.subtopic === topic.name);
        const correct = related.filter((q) => q.isCorrect).length;
        return {
          topicId: topic.id,
          topicName: topic.name,
          subjectName: subject?.name ?? "",
          accuracyRate: related.length > 0 ? correct / related.length : 0,
          totalQuestions: related.length,
        };
      })
      .filter((t) => t.totalQuestions > 0);

    const sorted = [...strengths].sort((a, b) => a.accuracyRate - b.accuracyRate);
    return {
      weakest: sorted.slice(0, limit),
      strongest: sorted.slice(-limit).reverse(),
    };
  },
};
