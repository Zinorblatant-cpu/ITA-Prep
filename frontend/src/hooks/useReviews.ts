import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CompleteReviewInput } from "@ita/shared-types";
import { reviewsApi } from "../services/reviews.service";

export function useUpcomingReviews() {
  return useQuery({
    queryKey: ["reviews", "upcoming"],
    queryFn: reviewsApi.upcoming,
  });
}

export function useReviews(params?: { status?: string; from?: string; to?: string }) {
  return useQuery({
    queryKey: ["reviews", "list", params],
    queryFn: () => reviewsApi.list(params),
  });
}

export function useCompleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: CompleteReviewInput }) =>
      reviewsApi.complete(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
    },
  });
}

export function useSkipReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reviewsApi.skip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
