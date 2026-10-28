import { Trash2 } from "lucide-react";
import type { ErrorNotebookEntryDTO, ErrorStatus, ErrorType } from "@ita/shared-types";
import { useDeleteErrorEntry, useUpdateErrorEntry } from "../../hooks/useErrorNotebook";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { Select } from "../ui/Select";
import { formatDate } from "../../utils/format";

const ERROR_TYPE_LABEL: Record<ErrorType, string> = {
  distracao: "Distração",
  conceito: "Conceito",
  calculo: "Cálculo",
  interpretacao: "Interpretação",
};

const STATUS_VARIANT: Record<ErrorStatus, "warning" | "accent" | "success"> = {
  pendente: "warning",
  revisado: "accent",
  dominado: "success",
};

const STATUS_LABEL: Record<ErrorStatus, string> = {
  pendente: "Pendente",
  revisado: "Revisado",
  dominado: "Dominado",
};

export function ErrorEntryCard({ entry }: { entry: ErrorNotebookEntryDTO }) {
  const updateEntry = useUpdateErrorEntry();
  const deleteEntry = useDeleteErrorEntry();

  async function handleDelete() {
    if (!confirm("Remover este registro do caderno de erros?")) return;
    await deleteEntry.mutateAsync(entry.id);
  }

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={STATUS_VARIANT[entry.status]}>{STATUS_LABEL[entry.status]}</Badge>
          <Badge variant="neutral">{ERROR_TYPE_LABEL[entry.errorType]}</Badge>
          {entry.source && <Badge variant="neutral">{entry.source}</Badge>}
          <span className="ml-auto text-xs text-ink-subtle">{formatDate(entry.createdAt)}</span>
        </div>
        <p className="mt-2 whitespace-pre-wrap text-sm text-ink">{entry.questionText}</p>
        {entry.correction && (
          <div className="mt-2 rounded-md bg-surface-subtle p-2.5">
            <p className="text-xs font-medium text-ink-muted">Correção</p>
            <p className="mt-0.5 whitespace-pre-wrap text-sm text-ink">{entry.correction}</p>
          </div>
        )}
        {entry.imageUrl && (
          <img src={entry.imageUrl} alt="Imagem da questão" className="mt-2 max-h-64 rounded-md border border-border" />
        )}
        <div className="mt-3 flex items-center justify-between">
          <Select
            value={entry.status}
            onChange={(e) => updateEntry.mutate({ id: entry.id, input: { status: e.target.value as ErrorStatus } })}
            className="w-40"
          >
            <option value="pendente">Pendente</option>
            <option value="revisado">Revisado</option>
            <option value="dominado">Dominado</option>
          </Select>
          <Button size="icon" variant="ghost" onClick={handleDelete} aria-label="Remover">
            <Trash2 size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
