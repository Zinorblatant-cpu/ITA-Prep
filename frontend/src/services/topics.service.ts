import type { CreateTopicInput, TopicDTO, UpdateTopicInput } from "@ita/shared-types";
import { apiClient, type ApiEnvelope } from "./api-client";

export const topicsApi = {
  async listBySubject(subjectId: number): Promise<TopicDTO[]> {
    const { data } = await apiClient.get<ApiEnvelope<TopicDTO[]>>("/topics", { params: { subjectId } });
    return data.data;
  },

  async create(input: CreateTopicInput): Promise<TopicDTO> {
    const { data } = await apiClient.post<ApiEnvelope<TopicDTO>>("/topics", input);
    return data.data;
  },

  async update(id: number, input: UpdateTopicInput): Promise<TopicDTO> {
    const { data } = await apiClient.patch<ApiEnvelope<TopicDTO>>(`/topics/${id}`, input);
    return data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/topics/${id}`);
  },

  async complete(id: number): Promise<{ topic: TopicDTO; reviewsGenerated: number }> {
    const { data } = await apiClient.post<ApiEnvelope<{ topic: TopicDTO; reviewsGenerated: number }>>(
      `/topics/${id}/complete`,
    );
    return data.data;
  },
};
