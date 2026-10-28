import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { Skeleton } from "./components/ui/Skeleton";

const DashboardPage = lazy(() => import("./pages/DashboardPage").then((m) => ({ default: m.DashboardPage })));
const SubjectsPage = lazy(() => import("./pages/SubjectsPage").then((m) => ({ default: m.SubjectsPage })));
const SubjectDetailPage = lazy(() => import("./pages/SubjectDetailPage").then((m) => ({ default: m.SubjectDetailPage })));
const StudySessionPage = lazy(() => import("./pages/StudySessionPage").then((m) => ({ default: m.StudySessionPage })));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage").then((m) => ({ default: m.ReviewsPage })));
const ErrorNotebookPage = lazy(() => import("./pages/ErrorNotebookPage").then((m) => ({ default: m.ErrorNotebookPage })));
const QuestionsPage = lazy(() => import("./pages/QuestionsPage").then((m) => ({ default: m.QuestionsPage })));
const GoalsPage = lazy(() => import("./pages/GoalsPage").then((m) => ({ default: m.GoalsPage })));
const StatisticsPage = lazy(() => import("./pages/StatisticsPage").then((m) => ({ default: m.StatisticsPage })));
const MockExamsPage = lazy(() => import("./pages/MockExamsPage").then((m) => ({ default: m.MockExamsPage })));
const GamificationPage = lazy(() => import("./pages/GamificationPage").then((m) => ({ default: m.GamificationPage })));
const CalendarPage = lazy(() => import("./pages/CalendarPage").then((m) => ({ default: m.CalendarPage })));
const SettingsPage = lazy(() => import("./pages/SettingsPage").then((m) => ({ default: m.SettingsPage })));

function PageFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/subjects/:id" element={<SubjectDetailPage />} />
          <Route path="/study-session" element={<StudySessionPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/error-notebook" element={<ErrorNotebookPage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/mock-exams" element={<MockExamsPage />} />
          <Route path="/gamification" element={<GamificationPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
