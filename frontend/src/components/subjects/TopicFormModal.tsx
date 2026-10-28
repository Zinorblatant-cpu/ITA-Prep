import { useEffect, useState } from "react";
import type { Difficulty, Priority, TopicDTO } from "@ita/shared-types";
import { useCreateTopic, useUpdateTopic } from "../../hooks/useTopics";
import { useToast } from "../ui/Toast";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";

interface TopicFormModalProps {
  open: boolean;
  onClose: () => void;
  subjectId: number;
  topic?: TopicDTO | null;
}

const EMPTY_FORM = {
  name: "",
  description: "",
  difficulty: "" as Difficulty | "",
  priority: "" as Priority | "",
  notes: "",
};

export function TopicFormModal({ open, onClose, subjectId, topic }: TopicFormModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const createTopic = useCreateTopic();
  const updateTopic = useUpdateTopic();
  const { toast } = useToast();

  useEffect(() => {
    if (topic) {
      setForm({
        name: topic.name,
        description: topic.description ?? "",
        difficulty: topic.difficulty ?? "",
        priority: topic.priority ?? "",
        notes: topic.notes ?? "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [topic, open]);

  const isPending = createTopic.isPending || updateTopic.isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;

    const payload = {
      name: form.name.trim(),
      description: form.description || undefined,
      difficulty: form.difficulty || undefined,
      priority: form.priority || undefined,
      notes: form.notes || undefined,
    };

    try {
      if (topic) {
        await updateTopic.mutateAsync({ id: topic.id, input: payload });
        toast({ title: "Conteúdo atualizado", variant: "success" });
      } else {
        await createTopic.mutateAsync({ subjectId, ...payload });
        toast({ title: "Conteúdo criado", variant: "success" });
      }
      onClose();
    } catch {
      toast({ title: "Não foi possível salvar o conteúdo", variant: "error" });
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={topic ? "Editar conteúdo" : "Novo conteúdo"}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-muted">Nome</label>
          <Input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Ex: Trigonometria"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-muted">Descrição</label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">Dificuldade</label>
            <Select
              value={form.difficulty}
              onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value as Difficulty }))}
            >
              <option value="">—</option>
              <option value="facil">Fácil</option>
              <option value="medio">Médio</option>
              <option value="dificil">Difícil</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">Prioridade</label>
            <Select
              value={form.priority}
              onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as Priority }))}
            >
              <option value="">—</option>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </Select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-muted">Observações</label>
          <Textarea
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
