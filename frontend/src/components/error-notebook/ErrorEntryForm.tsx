import { useState } from "react";
import type { ErrorType } from "@ita/shared-types";
import { useSubjects } from "../../hooks/useSubjects";
import { useTopics } from "../../hooks/useTopics";
import { useCreateErrorEntry } from "../../hooks/useErrorNotebook";
import { useToast } from "../ui/Toast";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";

const ERROR_TYPE_LABEL: Record<ErrorType, string> = {
  distracao: "Distração",
  conceito: "Conceito",
  calculo: "Cálculo",
  interpretacao: "Interpretação",
};

export function ErrorEntryForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: subjects } = useSubjects();
  const [subjectId, setSubjectId] = useState<number | "">("");
  const [topicId, setTopicId] = useState<number | "">("");
  const [questionText, setQuestionText] = useState("");
  const [source, setSource] = useState("");
  const [errorType, setErrorType] = useState<ErrorType>("conceito");
  const [correction, setCorrection] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const { data: topics } = useTopics(Number(subjectId));
  const createEntry = useCreateErrorEntry();
  const { toast } = useToast();

  function reset() {
    setSubjectId("");
    setTopicId("");
    setQuestionText("");
    setSource("");
    setErrorType("conceito");
    setCorrection("");
    setImageUrl("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subjectId || !questionText.trim()) return;
    try {
      await createEntry.mutateAsync({
        subjectId: Number(subjectId),
        topicId: topicId ? Number(topicId) : undefined,
        questionText: questionText.trim(),
        source: source || undefined,
        errorType,
        correction: correction || undefined,
        imageUrl: imageUrl || undefined,
      });
      toast({ title: "Erro registrado no caderno", variant: "success" });
      reset();
      onClose();
    } catch {
      toast({ title: "Não foi possível registrar o erro", variant: "error" });
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Novo registro no caderno de erros">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">Matéria</label>
            <Select value={subjectId} onChange={(e) => { setSubjectId(Number(e.target.value)); setTopicId(""); }} required>
              <option value="">Selecione...</option>
              {subjects?.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">Assunto</label>
            <Select value={topicId} onChange={(e) => setTopicId(Number(e.target.value))} disabled={!subjectId}>
              <option value="">—</option>
              {topics?.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </Select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-muted">Questão</label>
          <Textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} required placeholder="Cole ou descreva a questão" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">Fonte</label>
            <Input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Ex: ITA 2022" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">Tipo de erro</label>
            <Select value={errorType} onChange={(e) => setErrorType(e.target.value as ErrorType)}>
              {Object.entries(ERROR_TYPE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-muted">Correção</label>
          <Textarea value={correction} onChange={(e) => setCorrection(e.target.value)} placeholder="Como resolver corretamente" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-muted">URL da imagem (opcional)</label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={createEntry.isPending}>Salvar</Button>
        </div>
      </form>
    </Modal>
  );
}
