import { useState } from "react";
import { RotateCcw } from "lucide-react";
import type { ReviewDTO } from "@ita/shared-types";
import { EmptyState } from "../ui/EmptyState";
import { Skeleton } from "../ui/Skeleton";
import { CompleteReviewModal } from "./CompleteReviewModal";
import { ReviewCard } from "./ReviewCard";

export function ReviewList({ reviews, isLoading }: { reviews: ReviewDTO[] | undefined; isLoading: boolean }) {
  const [selected, setSelected] = useState<ReviewDTO | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return <EmptyState icon={RotateCcw} title="Nenhuma revisão nesta categoria" />;
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} onComplete={() => setSelected(review)} />
      ))}
      <CompleteReviewModal review={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
