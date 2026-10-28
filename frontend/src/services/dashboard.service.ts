import type { DashboardSummaryDTO } from "@ita/shared-types";
import { apiClient, type ApiEnvelope } from "./api-client";

export const dashboardApi = {
  async getSummary(): Promise<DashboardSummaryDTO> {
    const { data } = await apiClient.get<ApiEnvelope<DashboardSummaryDTO>>("/dashboard/summary");
    return data.data;
  },
};
