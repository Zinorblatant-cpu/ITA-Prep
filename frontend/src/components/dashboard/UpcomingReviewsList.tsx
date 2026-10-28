import { RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useUpcomingReviews } from "../../hooks/useReviews";
import { Badge } from "../ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { EmptyState } from "../ui/EmptyState";
import { Skeleton } from "../ui/Skeleton";
import { formatDate } from "../../utils/format";
import type { ReviewStatus } from "@ita/shared-types";

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

export function UpcomingReviewsList() {
  const { data, isLoading } = useUpcomingReviews();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas revisões</CardTitle>
        <Link to="/reviews" className="text-xs font-medium text-accent hover:underline">
          Ver todas
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}
        {!isLoading && data?.length === 0 && (
          <EmptyState icon={RotateCcw} title="Nenhuma revisão pendente" description="Conclua conteúdos para gerar revisões automáticas." />
        )}
        {!isLoading && data && data.length > 0 && (
          <ul className="divide-y divide-border">
            {data.map((review) => (
              <li key={review.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{review.topicName}</p>
                  <p className="text-xs text-ink-subtle">
                    {review.subjectName} · {formatDate(review.scheduledDate)}
                  </p>
                </div>
                <Badge variant={STATUS_VARIANT[review.status]}>{STATUS_LABEL[review.status]}</Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
