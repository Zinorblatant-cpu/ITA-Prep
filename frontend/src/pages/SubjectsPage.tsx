import { motion } from "framer-motion";
import { useSubjects } from "../hooks/useSubjects";
import { SubjectCard } from "../components/subjects/SubjectCard";
import { Skeleton } from "../components/ui/Skeleton";

export function SubjectsPage() {
  const { data: subjects, isLoading } = useSubjects();

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-ink">Disciplinas</h1>
        <p className="text-sm text-ink-subtle">Acompanhe o progresso em cada disciplina do edital do ITA.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        {subjects?.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </motion.div>
  );
}
