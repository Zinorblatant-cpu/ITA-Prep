import { motion } from "framer-motion";
import { AccuracyLineChart } from "../components/charts/AccuracyLineChart";
import { HoursBarChart } from "../components/charts/HoursBarChart";
import { QuestionsBySubjectChart } from "../components/charts/QuestionsBySubjectChart";
import { StudyHeatmap } from "../components/charts/StudyHeatmap";
import { SubjectRadarChart } from "../components/charts/SubjectRadarChart";
import { WeakStrongTopicsList } from "../components/charts/WeakStrongTopicsList";

export function StatisticsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-ink">Estatísticas</h1>
        <p className="text-sm text-ink-subtle">Sua evolução em números — horas, acertos e consistência.</p>
      </div>

      <StudyHeatmap />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <HoursBarChart />
        <AccuracyLineChart />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SubjectRadarChart />
        <QuestionsBySubjectChart />
      </div>

      <WeakStrongTopicsList />
    </motion.div>
  );
}
