import type { CreateQuestionInput, QuestionDTO, UpdateQuestionInput } from "@ita/shared-types";
import { apiClient, type ApiEnvelope } from "./api-client";

export const questionsApi = {
  async list(params?: { origin?: string; subjectId?: number; year?: number }): Promise<QuestionDTO[]> {
    const { data } = await apiClient.get<ApiEnvelope<QuestionDTO[]>>("/questions", { params });
    return data.data;
  },
  async create(input: CreateQuestionInput): Promise<QuestionDTO> {
    const { data } = await apiClient.post<ApiEnvelope<QuestionDTO>>("/questions", input);
    return data.data;
  },
  async update(id: number, input: UpdateQuestionInput): Promise<QuestionDTO> {
    const { data } = await apiClient.patch<ApiEnvelope<QuestionDTO>>(`/questions/${id}`, input);
    return data.data;
  },
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/questions/${id}`);
  },
};
