import { CheckCircle2, Pencil, Trash2 } from "lucide-react";
import type { TopicDTO, TopicStatus } from "@ita/shared-types";
import { useCompleteTopic, useDeleteTopic } from "../../hooks/useTopics";
import { useToast } from "../ui/Toast";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ProgressBar } from "../ui/ProgressBar";

const STATUS_LABEL: Record<TopicStatus, string> = {
  nao_iniciado: "Não iniciado",
  em_andamento: "Em andamento",
  concluido: "Concluído",
  revisao: "Em revisão",
};

const STATUS_VARIANT: Record<TopicStatus, "neutral" | "accent" | "success" | "warning"> = {
  nao_iniciado: "neutral",
  em_andamento: "accent",
  concluido: "success",
  revisao: "warning",
};

const DIFFICULTY_LABEL: Record<string, string> = { facil: "Fácil", medio: "Médio", dificil: "Difícil" };
const PRIORITY_LABEL: Record<string, string> = { baixa: "Baixa", media: "Média", alta: "Alta" };

export function TopicRow({ topic, onEdit }: { topic: TopicDTO; onEdit: () => void }) {
  const completeTopic = useCompleteTopic();
  const deleteTopic = useDeleteTopic();
  const { toast } = useToast();

  async function handleComplete() {
    try {
      const result = await completeTopic.mutateAsync(topic.id);
      toast({
        title: "Conteúdo concluído!",
        description: `${result.reviewsGenerated} revisões agendadas automaticamente.`,
        variant: "success",
      });
    } catch {
      toast({ title: "Não foi possível concluir o conteúdo", variant: "error" });
    }
  }

  async function handleDelete() {
    if (!confirm(`Remover "${topic.name}"?`)) return;
    await deleteTopic.mutateAsync(topic.id);
  }

  return (
    <div className="flex flex-col gap-3 border-b border-border py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-ink">{topic.name}</p>
          <Badge variant={STATUS_VARIANT[topic.status]}>{STATUS_LABEL[topic.status]}</Badge>
          {topic.difficulty && <Badge variant="neutral">{DIFFICULTY_LABEL[topic.difficulty]}</Badge>}
          {topic.priority && (
            <Badge variant={topic.priority === "alta" ? "danger" : "neutral"}>
              Prioridade {PRIORITY_LABEL[topic.priority]}
            </Badge>
          )}
        </div>
        {topic.description && <p className="mt-1 text-xs text-ink-subtle">{topic.description}</p>}
        <div className="mt-2 max-w-xs">
          <ProgressBar value={topic.progressPercentage} />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {topic.status !== "concluido" && (
          <Button size="sm" variant="secondary" onClick={handleComplete} disabled={completeTopic.isPending}>
            <CheckCircle2 size={14} /> Concluir
          </Button>
        )}
        <Button size="icon" variant="ghost" onClick={onEdit} aria-label="Editar">
          <Pencil size={14} />
        </Button>
        <Button size="icon" variant="ghost" onClick={handleDelete} aria-label="Remover">
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}
