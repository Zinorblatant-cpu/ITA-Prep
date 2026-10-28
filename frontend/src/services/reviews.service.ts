import type { CompleteReviewInput, ReviewDTO } from "@ita/shared-types";
import { apiClient, type ApiEnvelope } from "./api-client";

export const reviewsApi = {
  async list(params?: { status?: string; from?: string; to?: string }): Promise<ReviewDTO[]> {
    const { data } = await apiClient.get<ApiEnvelope<ReviewDTO[]>>("/reviews", { params });
    return data.data;
  },

  async upcoming(): Promise<ReviewDTO[]> {
    const { data } = await apiClient.get<ApiEnvelope<ReviewDTO[]>>("/reviews/upcoming");
    return data.data;
  },

  async complete(id: number, input: CompleteReviewInput) {
    const { data } = await apiClient.patch<ApiEnvelope<{ review: ReviewDTO; xpEarned: number; levelUp: boolean }>>(
      `/reviews/${id}/complete`,
      input,
    );
    return data.data;
  },

  async skip(id: number): Promise<ReviewDTO> {
    const { data } = await apiClient.patch<ApiEnvelope<ReviewDTO>>(`/reviews/${id}/skip`);
    return data.data;
  },
};
