import { CheckCircle2, ClipboardList, ListChecks, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { StatCard } from "../components/dashboard/StatCard";
import { HoursSummary } from "../components/dashboard/HoursSummary";
import { CountdownITA } from "../components/dashboard/CountdownITA";
import { StreakBadge } from "../components/dashboard/StreakBadge";
import { StudyCalendarWidget } from "../components/dashboard/StudyCalendarWidget";
import { UpcomingReviewsList } from "../components/dashboard/UpcomingReviewsList";
import { Skeleton } from "../components/ui/Skeleton";
import { formatPercentage } from "../utils/format";

export function DashboardPage() {
  const { data, isLoading } = useDashboardSummary();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-ink">Dashboard</h1>
        <p className="text-sm text-ink-subtle">Sua evolução na preparação para o ITA 2028.</p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={ListChecks} label="Questões resolvidas" value={String(data.questionsResolved)} />
            <StatCard icon={CheckCircle2} label="Questões corretas" value={String(data.questionsCorrect)} />
            <StatCard icon={Target} label="Taxa de acerto" value={formatPercentage(data.accuracyRate)} />
            <StatCard icon={ClipboardList} label="Simulados feitos" value={String(data.mockExamsCount)} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <HoursSummary
                hoursToday={data.hoursToday}
                hoursThisWeek={data.hoursThisWeek}
                hoursThisMonth={data.hoursThisMonth}
                hoursTotal={data.hoursTotal}
              />
            </div>
            <StreakBadge
              currentStreak={data.currentStreak}
              longestStreak={data.longestStreak}
              level={data.level}
              totalXp={data.totalXp}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <CountdownITA
              daysUntilExam={data.daysUntilExam}
              examDate={data.examDate}
              progressToExamPercentage={data.progressToExamPercentage}
            />
            <StudyCalendarWidget />
            <UpcomingReviewsList />
          </div>
        </>
      )}
    </motion.div>
  );
}
