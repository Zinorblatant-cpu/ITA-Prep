import type { CreateGoalInput, GoalDTO, GoalProgressDTO } from "@ita/shared-types";
import { apiClient, type ApiEnvelope } from "./api-client";

export const goalsApi = {
  async list(type?: string): Promise<GoalDTO[]> {
    const { data } = await apiClient.get<ApiEnvelope<GoalDTO[]>>("/goals", { params: { type } });
    return data.data;
  },
  async create(input: CreateGoalInput): Promise<GoalDTO> {
    const { data } = await apiClient.post<ApiEnvelope<GoalDTO>>("/goals", input);
    return data.data;
  },
  async progress(id: number): Promise<GoalProgressDTO> {
    const { data } = await apiClient.get<ApiEnvelope<GoalProgressDTO>>(`/goals/${id}/progress`);
    return data.data;
  },
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/goals/${id}`);
  },
};
