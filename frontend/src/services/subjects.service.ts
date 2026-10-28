import type { SubjectDTO, SubjectStatsDTO } from "@ita/shared-types";
import { apiClient, type ApiEnvelope } from "./api-client";

export const subjectsApi = {
  async list(): Promise<SubjectDTO[]> {
    const { data } = await apiClient.get<ApiEnvelope<SubjectDTO[]>>("/subjects");
    return data.data;
  },

  async getById(id: number): Promise<SubjectDTO> {
    const { data } = await apiClient.get<ApiEnvelope<SubjectDTO>>(`/subjects/${id}`);
    return data.data;
  },

  async getStats(id: number): Promise<SubjectStatsDTO> {
    const { data } = await apiClient.get<ApiEnvelope<SubjectStatsDTO>>(`/subjects/${id}/stats`);
    return data.data;
  },
};
