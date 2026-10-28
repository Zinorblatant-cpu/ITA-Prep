import { ArrowLeft, BookOpenCheck, CheckCircle2, Clock, Target } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { useSubject, useSubjectStats } from "../hooks/useSubjects";
import { StatCard } from "../components/dashboard/StatCard";
import { TopicList } from "../components/subjects/TopicList";
import { Skeleton } from "../components/ui/Skeleton";
import { resolveIcon } from "../utils/icon-map";
import { formatHours, formatPercentage } from "../utils/format";

export function SubjectDetailPage() {
  const { id } = useParams();
  const subjectId = Number(id);
  const { data: subject, isLoading: loadingSubject } = useSubject(subjectId);
  const { data: stats, isLoading: loadingStats } = useSubjectStats(subjectId);

  const Icon = resolveIcon(subject?.icon);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <Link to="/subjects" className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-ink-subtle hover:text-ink">
        <ArrowLeft size={14} /> Disciplinas
      </Link>

      {loadingSubject && <Skeleton className="h-10 w-64" />}
      {subject && (
        <div className="mb-6 flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${subject.color}1a`, color: subject.color }}
          >
            <Icon size={22} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-ink">{subject.name}</h1>
            <p className="text-sm text-ink-subtle">Progresso, conteúdos e revisões desta disciplina.</p>
          </div>
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loadingStats &&
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        {stats && (
          <>
            <StatCard icon={Target} label="Progresso" value={formatPercentage(stats.progressPercentage / 100)} />
            <StatCard
              icon={BookOpenCheck}
              label="Conteúdos concluídos"
              value={`${stats.completedTopics}/${stats.totalTopics}`}
            />
            <StatCard icon={Clock} label="Horas estudadas" value={formatHours(stats.totalHours)} />
            <StatCard icon={CheckCircle2} label="Taxa de acerto" value={formatPercentage(stats.accuracyRate)} />
          </>
        )}
      </div>

      {Number.isFinite(subjectId) && <TopicList subjectId={subjectId} />}
    </motion.div>
  );
}
