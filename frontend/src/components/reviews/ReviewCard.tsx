import { SkipForward } from "lucide-react";
import type { ReviewDTO, ReviewStatus } from "@ita/shared-types";
import { useSkipReview } from "../../hooks/useReviews";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { formatDate } from "../../utils/format";

const STATUS_VARIANT: Record<ReviewStatus, "neutral" | "accent" | "success" | "warning" | "danger"> = {
  pendente: "accent",
  concluida: "success",
  atrasada: "danger",
  pulada: "neutral",
};

const STATUS_LABEL: Record<ReviewStatus, string> = {
  pendente: "Pendente",
  concluida: "Concluída",
  atrasada: "Atrasada",
  pulada: "Pulada",
};

export function ReviewCard({ review, onComplete }: { review: ReviewDTO; onComplete: () => void }) {
  const skipReview = useSkipReview();
  const isActionable = review.status === "pendente" || review.status === "atrasada";

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-ink">{review.topicName}</p>
            <Badge variant={STATUS_VARIANT[review.status]}>{STATUS_LABEL[review.status]}</Badge>
            <Badge variant="neutral">+{review.intervalDays}d</Badge>
          </div>
          <p className="mt-1 text-xs text-ink-subtle">
            {review.subjectName} · agendada para {formatDate(review.scheduledDate)}
          </p>
          {review.performanceRating && (
            <p className="mt-1 text-xs text-ink-subtle">Avaliação: {review.performanceRating}</p>
          )}
        </div>
        {isActionable && (
          <div className="flex shrink-0 gap-2">
            <Button size="sm" variant="secondary" onClick={() => skipReview.mutate(review.id)} disabled={skipReview.isPending}>
              <SkipForward size={14} /> Pular
            </Button>
            <Button size="sm" onClick={onComplete}>
              Concluir
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
