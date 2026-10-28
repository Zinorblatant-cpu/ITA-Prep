import { motion } from "framer-motion";
import { BookX, Plus } from "lucide-react";
import { useState } from "react";
import { ErrorEntryCard } from "../components/error-notebook/ErrorEntryCard";
import { ErrorEntryForm } from "../components/error-notebook/ErrorEntryForm";
import { ErrorFilterBar } from "../components/error-notebook/ErrorFilterBar";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";
import { useErrorNotebookEntries } from "../hooks/useErrorNotebook";

export function ErrorNotebookPage() {
  const [status, setStatus] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const { data: entries, isLoading } = useErrorNotebookEntries({
    status: status || undefined,
    subjectId: subjectId ? Number(subjectId) : undefined,
  });

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">Caderno de Erros</h1>
          <p className="text-sm text-ink-subtle">Registre e revise os erros que mais se repetem.</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus size={14} /> Novo registro
        </Button>
      </div>

      <div className="mb-4">
        <ErrorFilterBar status={status} onStatusChange={setStatus} subjectId={subjectId} onSubjectChange={setSubjectId} />
      </div>

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {!isLoading && entries?.length === 0 && (
        <EmptyState icon={BookX} title="Nenhum erro registrado" description="Registre erros de questões para revisá-los depois." />
      )}

      {!isLoading && entries && entries.length > 0 && (
        <div className="space-y-3">
          {entries.map((entry) => (
            <ErrorEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      <ErrorEntryForm open={formOpen} onClose={() => setFormOpen(false)} />
    </motion.div>
  );
}
