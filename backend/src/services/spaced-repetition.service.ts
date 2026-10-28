import { addDays } from "../utils/date";
import { reviewRepository } from "../repositories/review.repository";
import type { ReviewInterval } from "@ita/shared-types";

const REVIEW_INTERVALS: ReviewInterval[] = [1, 7, 30, 90, 180];
const POOR_PERFORMANCE_EXTRA_DAYS = 3;

export const spacedRepetitionService = {
  /**
   * Gera o ciclo padrão de revisões (1/7/30/90/180 dias) a partir da data de conclusão de um conteúdo.
   */
  scheduleReviewsForTopic(topicId: number, completedAt: Date, originSessionId?: number) {
    const rows = REVIEW_INTERVALS.map((intervalDays) => ({
      topicId,
      originSessionId: originSessionId ?? null,
      scheduledDate: addDays(completedAt, intervalDays),
      intervalDays,
      status: "pendente" as const,
    }));
    return reviewRepository.createMany(rows);
  },

  /**
   * Reforço: se a revisão foi avaliada como "ruim", agenda uma revisão extra antes do próximo ciclo.
   */
  rescheduleIfPoor(topicId: number, performanceRating: "ruim" | "medio" | "bom") {
    if (performanceRating !== "ruim") return null;
    const [extra] = reviewRepository.createMany([
      {
        topicId,
        scheduledDate: addDays(new Date(), POOR_PERFORMANCE_EXTRA_DAYS),
        intervalDays: POOR_PERFORMANCE_EXTRA_DAYS,
        status: "pendente",
      },
    ]);
    return extra;
  },
};
