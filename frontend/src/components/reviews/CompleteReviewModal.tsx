import { useState } from "react";
import type { ReviewDTO, ReviewPerformance } from "@ita/shared-types";
import { useCompleteReview } from "../../hooks/useReviews";
import { useToast } from "../ui/Toast";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Textarea } from "../ui/Textarea";
import { cn } from "../../utils/cn";

const OPTIONS: { value: ReviewPerformance; label: string }[] = [
  { value: "ruim", label: "Ruim" },
  { value: "medio", label: "Médio" },
  { value: "bom", label: "Bom" },
];

export function CompleteReviewModal({ review, onClose }: { review: ReviewDTO | null; onClose: () => void }) {
  const [rating, setRating] = useState<ReviewPerformance>("medio");
  const [notes, setNotes] = useState("");
  const completeReview = useCompleteReview();
  const { toast } = useToast();

  async function handleConfirm() {
    if (!review) return;
    try {
      const result = await completeReview.mutateAsync({ id: review.id, input: { performanceRating: rating, notes: notes || undefined } });
      toast({ title: `Revisão concluída! +${result.xpEarned} XP`, variant: "success" });
      setNotes("");
      onClose();
    } catch {
      toast({ title: "Não foi possível concluir a revisão", variant: "error" });
    }
  }

  return (
    <Modal open={!!review} onClose={onClose} title="Concluir revisão">
      <div className="space-y-4">
        <p className="text-sm text-ink-subtle">Como foi seu desempenho nesta revisão de "{review?.topicName}"?</p>
        <div className="flex gap-2">
          {OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRating(option.value)}
              className={cn(
                "flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                rating === option.value
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-ink-muted hover:bg-surface-subtle",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <Textarea placeholder="Observações (opcional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={completeReview.isPending}>
            Confirmar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
