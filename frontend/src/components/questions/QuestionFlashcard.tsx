import { motion } from "framer-motion";
import { RotateCw } from "lucide-react";
import { useState } from "react";
import type { QuestionDTO } from "@ita/shared-types";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { MarkdownContent } from "../ui/MarkdownContent";

interface QuestionFlashcardProps {
  question: QuestionDTO;
}

export function QuestionFlashcard({ question }: QuestionFlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div>
      <div style={{ perspective: 1200 }}>
        <motion.div
          className="relative min-h-[360px]"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.45 }}
        >
          <div
            className="absolute inset-0 overflow-y-auto rounded-md border border-border bg-surface-subtle p-4"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-subtle">Enunciado</p>
            {question.statementImage && (
              <img src={question.statementImage} alt="Foto do enunciado" className="mb-3 max-h-64 w-full rounded-md object-contain" />
            )}
            {question.statementText && <MarkdownContent content={question.statementText} className="mb-3" />}
            {!question.statementImage && !question.statementText && (
              <p className="text-sm text-ink-subtle">Nenhum enunciado registrado.</p>
            )}
            {question.alternatives && question.alternatives.length > 0 && (
              <ul className="space-y-1.5">
                {question.alternatives.map((alt) => (
                  <li key={alt.label} className="flex gap-2 rounded-md border border-border bg-surface px-2 py-1.5 text-sm">
                    <span className="font-semibold text-ink-muted">{alt.label})</span>
                    <MarkdownContent content={alt.text} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div
            className="absolute inset-0 overflow-y-auto rounded-md border border-border bg-surface-subtle p-4"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">Resolução</p>
              {question.correctAlternative && <Badge variant="success">Correta: {question.correctAlternative}</Badge>}
            </div>
            {question.resolutionImage && (
              <img src={question.resolutionImage} alt="Foto da resolução" className="mb-3 max-h-64 w-full rounded-md object-contain" />
            )}
            {question.resolutionText && <MarkdownContent content={question.resolutionText} />}
            {!question.resolutionImage && !question.resolutionText && (
              <p className="text-sm text-ink-subtle">Nenhuma resolução registrada.</p>
            )}
          </div>
        </motion.div>
      </div>
      <div className="mt-4 flex justify-center">
        <Button type="button" variant="secondary" onClick={() => setFlipped((f) => !f)}>
          <RotateCw size={14} /> {flipped ? "Ver enunciado" : "Ver resolução"}
        </Button>
      </div>
    </div>
  );
}

export function hasFlashcardContent(question: QuestionDTO): boolean {
  return Boolean(
    question.statementImage ||
      question.statementText ||
      (question.alternatives && question.alternatives.length > 0) ||
      question.resolutionImage ||
      question.resolutionText,
  );
}
