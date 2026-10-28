import { Plus } from "lucide-react";
import { useState } from "react";
import type { TopicDTO } from "@ita/shared-types";
import { useTopics } from "../../hooks/useTopics";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { EmptyState } from "../ui/EmptyState";
import { Skeleton } from "../ui/Skeleton";
import { TopicFormModal } from "./TopicFormModal";
import { TopicRow } from "./TopicRow";

export function TopicList({ subjectId }: { subjectId: number }) {
  const { data: topics, isLoading } = useTopics(subjectId);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<TopicDTO | null>(null);

  function openCreate() {
    setEditingTopic(null);
    setModalOpen(true);
  }

  function openEdit(topic: TopicDTO) {
    setEditingTopic(topic);
    setModalOpen(true);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Conteúdos</h2>
        <Button size="sm" onClick={openCreate}>
          <Plus size={14} /> Novo conteúdo
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          {isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          )}
          {!isLoading && topics?.length === 0 && (
            <EmptyState title="Nenhum conteúdo cadastrado" description="Adicione o primeiro conteúdo desta disciplina." />
          )}
          {!isLoading && topics && topics.length > 0 && (
            <div>
              {topics.map((topic) => (
                <TopicRow key={topic.id} topic={topic} onEdit={() => openEdit(topic)} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <TopicFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        subjectId={subjectId}
        topic={editingTopic}
      />
    </div>
  );
}
