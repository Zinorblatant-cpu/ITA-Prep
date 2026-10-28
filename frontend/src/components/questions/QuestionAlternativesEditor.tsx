import { Plus, Trash2 } from "lucide-react";
import type { QuestionAlternative } from "@ita/shared-types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

interface QuestionAlternativesEditorProps {
  alternatives: QuestionAlternative[];
  correctAlternative: string;
  onChange: (alternatives: QuestionAlternative[]) => void;
  onCorrectChange: (label: string) => void;
}

function nextLabel(alternatives: QuestionAlternative[]): string {
  const letters = "ABCDEFGHIJ";
  return letters[alternatives.length] ?? `${alternatives.length + 1}`;
}

export function QuestionAlternativesEditor({
  alternatives,
  correctAlternative,
  onChange,
  onCorrectChange,
}: QuestionAlternativesEditorProps) {
  function updateAlternative(index: number, patch: Partial<QuestionAlternative>) {
    const previousLabel = alternatives[index]?.label;
    const next = alternatives.map((alt, i) => (i === index ? { ...alt, ...patch } : alt));
    onChange(next);
    if (patch.label !== undefined && previousLabel !== undefined && correctAlternative === previousLabel) {
      onCorrectChange(patch.label);
    }
  }

  function removeAlternative(index: number) {
    const removed = alternatives[index];
    onChange(alternatives.filter((_, i) => i !== index));
    if (removed && correctAlternative === removed.label) onCorrectChange("");
  }

  function addAlternative() {
    onChange([...alternatives, { label: nextLabel(alternatives), text: "" }]);
  }

  return (
    <div className="space-y-2">
      {alternatives.map((alt, index) => (
        <div key={index} className="flex items-start gap-2 rounded-md border border-border p-2">
          <input
            type="radio"
            name="correct-alternative"
            className="mt-2.5 h-4 w-4 accent-accent"
            checked={correctAlternative === alt.label && alt.label !== ""}
            onChange={() => onCorrectChange(alt.label)}
            aria-label={`Marcar alternativa ${alt.label} como correta`}
          />
          <Input
            value={alt.label}
            onChange={(e) => updateAlternative(index, { label: e.target.value })}
            className="w-14 shrink-0 text-center"
            maxLength={3}
          />
          <Textarea
            value={alt.text}
            onChange={(e) => updateAlternative(index, { text: e.target.value })}
            placeholder="Texto da alternativa (aceita markdown/fórmulas)"
            rows={2}
            className="min-h-0 flex-1"
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => removeAlternative(index)} aria-label="Remover alternativa">
            <Trash2 size={14} />
          </Button>
        </div>
      ))}
      <Button type="button" variant="secondary" size="sm" onClick={addAlternative}>
        <Plus size={14} /> Adicionar alternativa
      </Button>
    </div>
  );
}
