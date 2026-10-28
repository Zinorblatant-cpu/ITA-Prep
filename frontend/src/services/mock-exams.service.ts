import type { CreateMockExamInput, MockExamComparisonDTO, MockExamDTO } from "@ita/shared-types";
import { apiClient, type ApiEnvelope } from "./api-client";

export const mockExamsApi = {
  async list(): Promise<MockExamDTO[]> {
    const { data } = await apiClient.get<ApiEnvelope<MockExamDTO[]>>("/mock-exams");
    return data.data;
  },
  async comparison(): Promise<MockExamComparisonDTO> {
    const { data } = await apiClient.get<ApiEnvelope<MockExamComparisonDTO>>("/mock-exams/comparison");
    return data.data;
  },
  async create(input: CreateMockExamInput): Promise<{ mockExam: MockExamDTO; xpEarned: number }> {
    const { data } = await apiClient.post<ApiEnvelope<{ mockExam: MockExamDTO; xpEarned: number }>>("/mock-exams", input);
    return data.data;
  },
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/mock-exams/${id}`);
  },
};
